package handlers

import (
	"net/http"
	"sort"
	"time"

	"cloud.google.com/go/firestore"
	"google.golang.org/api/iterator"

	"github.com/upkeep/api/internal/http/httpx"
)

type AnalyticsHandler struct {
	fs *firestore.Client
}

func NewAnalyticsHandler(fs *firestore.Client) *AnalyticsHandler {
	return &AnalyticsHandler{fs: fs}
}

// MTTR returns average + median mean-time-to-repair over a trailing window.
func (h *AnalyticsHandler) MTTR(w http.ResponseWriter, r *http.Request) {
	p, ok := requireOrg(w, r)
	if !ok {
		return
	}
	windowDays := 30
	since := time.Now().UTC().AddDate(0, 0, -windowDays)

	iter := h.fs.Collection("orgs").Doc(p.OrgID).Collection("tickets").
		Where("status", "==", "closed").
		Where("closedAt", ">=", since).
		Documents(r.Context())
	defer iter.Stop()

	type bucket struct {
		machineID string
		mttrs     []int
	}
	byMachine := map[string]*bucket{}
	var all []int

	for {
		doc, err := iter.Next()
		if err == iterator.Done {
			break
		}
		if err != nil {
			httpx.Error(w, http.StatusInternalServerError, "firestore", err.Error())
			return
		}
		d := doc.Data()
		mt, _ := d["mttrMinutes"].(int64)
		if mt == 0 {
			// older docs might not have computed it
			continue
		}
		mid, _ := d["machineId"].(string)
		all = append(all, int(mt))
		b, ok := byMachine[mid]
		if !ok {
			b = &bucket{machineID: mid}
			byMachine[mid] = b
		}
		b.mttrs = append(b.mttrs, int(mt))
	}

	resp := map[string]any{
		"orgId":             p.OrgID,
		"windowDays":        windowDays,
		"ticketCount":       len(all),
		"avgMttrMinutes":    avg(all),
		"medianMttrMinutes": median(all),
	}

	// per-machine breakdown (need machine names)
	names := map[string]string{}
	mIter := h.fs.Collection("orgs").Doc(p.OrgID).Collection("machines").Documents(r.Context())
	defer mIter.Stop()
	for {
		doc, err := mIter.Next()
		if err == iterator.Done {
			break
		}
		if err != nil {
			break
		}
		if n, ok := doc.Data()["name"].(string); ok {
			names[doc.Ref.ID] = n
		}
	}
	byM := make([]map[string]any, 0, len(byMachine))
	for mid, b := range byMachine {
		byM = append(byM, map[string]any{
			"machineId":      mid,
			"machineName":    names[mid],
			"avgMttrMinutes": avg(b.mttrs),
			"count":          len(b.mttrs),
		})
	}
	resp["byMachine"] = byM

	httpx.JSON(w, http.StatusOK, resp)
}

// Downtime returns a rough downtime summary: open tickets + critical count.
func (h *AnalyticsHandler) Downtime(w http.ResponseWriter, r *http.Request) {
	p, ok := requireOrg(w, r)
	if !ok {
		return
	}
	iter := h.fs.Collection("orgs").Doc(p.OrgID).Collection("tickets").
		Where("status", "in", []string{"open", "in_progress", "awaiting_parts"}).
		Documents(r.Context())
	defer iter.Stop()
	open := 0
	critical := 0
	for {
		doc, err := iter.Next()
		if err == iterator.Done {
			break
		}
		if err != nil {
			break
		}
		open++
		if pri, _ := doc.Data()["priority"].(string); pri == "critical" {
			critical++
		}
	}
	httpx.JSON(w, http.StatusOK, map[string]any{
		"openTickets":     open,
		"criticalTickets": critical,
	})
}

func avg(xs []int) int {
	if len(xs) == 0 {
		return 0
	}
	sum := 0
	for _, x := range xs {
		sum += x
	}
	return sum / len(xs)
}

func median(xs []int) int {
	if len(xs) == 0 {
		return 0
	}
	s := append([]int{}, xs...)
	sort.Ints(s)
	return s[len(s)/2]
}
