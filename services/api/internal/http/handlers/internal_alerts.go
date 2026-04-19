package handlers

import (
	"context"
	"log/slog"
	"net/http"
	"time"

	"cloud.google.com/go/firestore"
	"github.com/google/uuid"
	"google.golang.org/api/iterator"

	"github.com/upkeep/api/internal/http/httpx"
)

// InternalAlertsHandler is called by Cloud Scheduler → /internal/alerts/scan.
type InternalAlertsHandler struct {
	fs *firestore.Client
}

func NewInternalAlertsHandler(fs *firestore.Client) *InternalAlertsHandler {
	return &InternalAlertsHandler{fs: fs}
}

// Scan iterates machines across all orgs and creates predictive-maintenance alerts:
//  - service_due: nextServiceHours <= hoursRun
//  - hours_threshold: hoursRun within 10% of nextServiceHours
//  - recurring_issue: maintenance_log count >= 3 in last 90d per machine
func (h *InternalAlertsHandler) Scan(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	orgsIter := h.fs.Collection("orgs").Documents(ctx)
	defer orgsIter.Stop()

	created := 0
	for {
		orgDoc, err := orgsIter.Next()
		if err == iterator.Done {
			break
		}
		if err != nil {
			httpx.Error(w, http.StatusInternalServerError, "firestore", err.Error())
			return
		}
		orgID := orgDoc.Ref.ID
		n := h.scanOrg(ctx, orgID)
		created += n
	}
	slog.Info("alerts scan complete", "created", created)
	httpx.JSON(w, http.StatusOK, map[string]any{"created": created})
}

func (h *InternalAlertsHandler) scanOrg(ctx context.Context, orgID string) int {
	created := 0
	mIter := h.fs.Collection("orgs").Doc(orgID).Collection("machines").Documents(ctx)
	defer mIter.Stop()
	for {
		doc, err := mIter.Next()
		if err == iterator.Done {
			break
		}
		if err != nil {
			slog.Warn("machines iter", "err", err)
			return created
		}
		d := doc.Data()
		machineID := doc.Ref.ID
		name, _ := d["name"].(string)
		hours, _ := d["hoursRun"].(float64)
		next, _ := d["nextServiceHours"].(float64)
		if next > 0 && hours >= next {
			h.upsertAlert(ctx, orgID, machineID, name, "service_due", "Service overdue",
				"This machine is past its next scheduled service interval.", time.Now().UTC())
			created++
		} else if next > 0 && hours >= next*0.9 {
			h.upsertAlert(ctx, orgID, machineID, name, "hours_threshold", "Service due soon",
				"This machine is within 10% of its next service interval.", time.Now().UTC().AddDate(0, 0, 3))
			created++
		}
		// recurring issue: >=3 log entries in 90d
		since := time.Now().UTC().AddDate(0, 0, -90)
		count := 0
		lIter := h.fs.Collection("orgs").Doc(orgID).Collection("maintenance_log").
			Where("machineId", "==", machineID).
			Where("occurredAt", ">=", since).Documents(ctx)
		for {
			_, lerr := lIter.Next()
			if lerr == iterator.Done {
				break
			}
			if lerr != nil {
				break
			}
			count++
		}
		lIter.Stop()
		if count >= 3 {
			h.upsertAlert(ctx, orgID, machineID, name, "recurring_issue", "Recurring issue pattern",
				"This machine has logged 3+ issues in the last 90 days — investigate root cause.", time.Now().UTC())
			created++
		}
	}
	return created
}

func (h *InternalAlertsHandler) upsertAlert(ctx context.Context, orgID, machineID, machineName, kind, title, detail string, dueAt time.Time) {
	// Dedup by (kind + machineId + daystamp)
	daystamp := dueAt.UTC().Format("2006-01-02")
	key := kind + "_" + machineID + "_" + daystamp
	id := uuid.NewSHA1(uuid.NameSpaceOID, []byte(key)).String()
	_, _ = h.fs.Collection("orgs").Doc(orgID).Collection("alerts").Doc(id).Set(ctx, map[string]any{
		"machineId":   machineID,
		"machineName": machineName,
		"kind":        kind,
		"title":       title,
		"detail":      detail,
		"dueAt":       dueAt,
		"status":      "pending",
		"createdAt":   time.Now().UTC(),
	}, firestore.MergeAll)
}
