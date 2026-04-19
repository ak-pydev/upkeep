// seed creates a demo org, Haas VF-2 machine, sample manual (chunked + embedded
// with the stub embedder or real Gemini if GEMINI_API_KEY is set) and a
// handful of maintenance_log + ticket entries so the demo works on a fresh
// Firestore.
//
// Run:
//   cd services/api
//   FIRESTORE_EMULATOR_HOST=localhost:8080 \
//   GOOGLE_CLOUD_PROJECT=upkeep-dev go run ./cmd/seed
package main

import (
	"context"
	_ "embed"
	"log/slog"
	"os"
	"time"

	"cloud.google.com/go/firestore"

	"github.com/upkeep/api/internal/ai"
	"github.com/upkeep/api/internal/config"
	"github.com/upkeep/api/internal/docai"
	"github.com/upkeep/api/internal/vectorsearch"
)

//go:embed seed_manual_haas_vf2.txt
var haasManualText string

const (
	demoOrgID     = "demo-org"
	demoMachineID = "demo-haas-vf2"
	demoManualID  = "demo-haas-vf2-manual"
	demoOwnerUID  = "demo-owner"
)

func main() {
	logger := slog.New(slog.NewJSONHandler(os.Stdout, &slog.HandlerOptions{Level: slog.LevelInfo}))
	slog.SetDefault(logger)

	cfg, err := config.Load()
	if err != nil {
		slog.Error("config", "err", err)
		os.Exit(1)
	}
	ctx, cancel := context.WithTimeout(context.Background(), 2*time.Minute)
	defer cancel()

	fs, err := firestore.NewClient(ctx, cfg.FirebaseProjectID)
	if err != nil {
		slog.Error("firestore", "err", err)
		os.Exit(1)
	}
	defer fs.Close()

	aiClient := ai.New(ctx, cfg)
	docClient := docai.New(ctx, cfg)
	vstore, _ := vectorsearch.New(ctx, cfg, fs)

	// Org
	_, _ = fs.Collection("orgs").Doc(demoOrgID).Set(ctx, map[string]any{
		"name":       "Revolution Machining (Demo)",
		"plan":       "trial",
		"ssoEnabled": false,
		"createdAt":  time.Now().UTC(),
	}, firestore.MergeAll)

	// Owner member
	_, _ = fs.Collection("orgs").Doc(demoOrgID).Collection("members").Doc(demoOwnerUID).Set(ctx, map[string]any{
		"email":    "demo@upkeep.local",
		"role":     "owner",
		"joinedAt": time.Now().UTC(),
	}, firestore.MergeAll)

	// Machine
	_, _ = fs.Collection("orgs").Doc(demoOrgID).Collection("machines").Doc(demoMachineID).Set(ctx, map[string]any{
		"name":             "Haas VF-2 (#1)",
		"make":             "Haas",
		"model":            "VF-2",
		"serialNumber":     "VF2-123456",
		"hoursRun":         2480.0,
		"nextServiceHours": 2500.0,
		"installedAt":      time.Date(2022, 4, 1, 0, 0, 0, 0, time.UTC),
		"createdAt":        time.Now().UTC(),
		"updatedAt":        time.Now().UTC(),
	}, firestore.MergeAll)

	// Manual metadata
	_, _ = fs.Collection("orgs").Doc(demoOrgID).Collection("manuals").Doc(demoManualID).Set(ctx, map[string]any{
		"title":      "Haas VF-2 Operator's Manual (excerpt)",
		"machineId":  demoMachineID,
		"source":     "oem",
		"status":     "indexed",
		"uploadedBy": demoOwnerUID,
		"uploadedAt": time.Now().UTC(),
		"indexedAt":  time.Now().UTC(),
	}, firestore.MergeAll)

	// Parse synthetic manual → chunks → embeddings
	parsed, err := docClient.Parse(ctx, []byte(haasManualText), "text/plain")
	if err != nil {
		slog.Error("parse manual", "err", err)
		os.Exit(1)
	}
	slog.Info("manual parsed", "pages", len(parsed.Pages))

	chunks := []vectorsearch.Chunk{}
	for _, pg := range parsed.Pages {
		chunks = append(chunks, vectorsearch.Chunk{
			OrgID:       demoOrgID,
			ManualID:    demoManualID,
			ManualTitle: "Haas VF-2 Operator's Manual (excerpt)",
			MachineID:   demoMachineID,
			ChunkIndex:  pg.PageNumber - 1,
			Page:        pg.PageNumber,
			Text:        pg.Text,
		})
	}
	texts := make([]string, len(chunks))
	for i, c := range chunks {
		texts[i] = c.Text
	}
	embeds, err := aiClient.Embed(ctx, texts)
	if err != nil {
		slog.Error("embed", "err", err)
		os.Exit(1)
	}
	for i := range chunks {
		chunks[i].Embedding = embeds[i]
	}
	if err := vstore.UpsertChunks(ctx, demoOrgID, chunks); err != nil {
		slog.Error("upsert chunks", "err", err)
		os.Exit(1)
	}
	slog.Info("chunks upserted", "count", len(chunks))

	// Maintenance log entries
	logs := []map[string]any{
		{
			"machineId":     demoMachineID,
			"title":         "E32 error after power cycle",
			"issue":         "Error code E32 on startup — spindle orientation fault.",
			"resolution":    "Reseated the spindle encoder cable (PN 30-3480), ran homing procedure, cleared.",
			"technicianUid": demoOwnerUID,
			"occurredAt":    time.Now().UTC().AddDate(0, 0, -21),
			"createdAt":     time.Now().UTC().AddDate(0, 0, -21),
		},
		{
			"machineId":     demoMachineID,
			"title":         "Coolant low warning",
			"issue":         "Coolant level sensor tripped mid-program.",
			"resolution":    "Topped off coolant, cleaned sensor electrode, verified level.",
			"technicianUid": demoOwnerUID,
			"occurredAt":    time.Now().UTC().AddDate(0, 0, -12),
			"createdAt":     time.Now().UTC().AddDate(0, 0, -12),
		},
		{
			"machineId":     demoMachineID,
			"title":         "Scheduled lubrication",
			"issue":         "500-hour lubrication milestone.",
			"resolution":    "Lubricated ways and ballscrews per maintenance schedule.",
			"technicianUid": demoOwnerUID,
			"occurredAt":    time.Now().UTC().AddDate(0, 0, -5),
			"createdAt":     time.Now().UTC().AddDate(0, 0, -5),
		},
	}
	for i, lg := range logs {
		id := "seed-log-" + string(rune('a'+i))
		_, _ = fs.Collection("orgs").Doc(demoOrgID).Collection("maintenance_log").Doc(id).Set(ctx, lg, firestore.MergeAll)
	}

	// Tickets
	_, _ = fs.Collection("orgs").Doc(demoOrgID).Collection("tickets").Doc("seed-ticket-open").Set(ctx, map[string]any{
		"machineId":   demoMachineID,
		"title":       "Intermittent Z-axis overload",
		"description": "Rapid move to Z0.1 throws overload alarm ~10% of the time.",
		"status":      "open",
		"priority":    "high",
		"reporterUid": demoOwnerUID,
		"createdAt":   time.Now().UTC().AddDate(0, 0, -1),
		"openedAt":    time.Now().UTC().AddDate(0, 0, -1),
	}, firestore.MergeAll)

	_, _ = fs.Collection("orgs").Doc(demoOrgID).Collection("tickets").Doc("seed-ticket-closed").Set(ctx, map[string]any{
		"machineId":   demoMachineID,
		"title":       "E32 spindle fault",
		"description": "E32 at startup — see log entry.",
		"status":      "closed",
		"priority":    "critical",
		"reporterUid": demoOwnerUID,
		"createdAt":   time.Now().UTC().AddDate(0, 0, -21),
		"openedAt":    time.Now().UTC().AddDate(0, 0, -21),
		"resolvedAt":  time.Now().UTC().AddDate(0, 0, -21).Add(90 * time.Minute),
		"closedAt":    time.Now().UTC().AddDate(0, 0, -21).Add(90 * time.Minute),
		"mttrMinutes": 90,
	}, firestore.MergeAll)

	slog.Info("seed complete",
		"org", demoOrgID, "machine", demoMachineID, "manual", demoManualID,
		"chunks", len(chunks), "logs", len(logs),
	)
}
