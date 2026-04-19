// alerts-worker scans Firestore for machines approaching a service threshold
// and creates alerts. Invoked as a Cloud Run Job by Cloud Scheduler nightly.
//
// In prod, Scheduler calls the API's /internal/alerts/scan endpoint directly.
// This command exists as an alternative for setups that prefer Cloud Run Jobs.
package main

import (
	"context"
	"log/slog"
	"net/http"
	"os"
	"time"

	"cloud.google.com/go/firestore"

	"github.com/upkeep/api/internal/config"
	"github.com/upkeep/api/internal/http/handlers"
)

func main() {
	logger := slog.New(slog.NewJSONHandler(os.Stdout, &slog.HandlerOptions{Level: slog.LevelInfo}))
	slog.SetDefault(logger)

	cfg, err := config.Load()
	if err != nil {
		slog.Error("config", "err", err)
		os.Exit(1)
	}
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Minute)
	defer cancel()

	fs, err := firestore.NewClient(ctx, cfg.FirebaseProjectID)
	if err != nil {
		slog.Error("firestore init", "err", err)
		os.Exit(1)
	}
	defer fs.Close()

	h := handlers.NewInternalAlertsHandler(fs)
	// Synthesize a minimal request so we can reuse the HTTP handler body.
	rr := &fakeWriter{}
	req, _ := http.NewRequestWithContext(ctx, http.MethodPost, "/internal/alerts/scan", nil)
	h.Scan(rr, req)
	slog.Info("alerts-worker done", "status", rr.status)
}

type fakeWriter struct {
	status int
	hdr    http.Header
}

func (f *fakeWriter) Header() http.Header {
	if f.hdr == nil {
		f.hdr = http.Header{}
	}
	return f.hdr
}
func (f *fakeWriter) Write(b []byte) (int, error) { return len(b), nil }
func (f *fakeWriter) WriteHeader(s int)           { f.status = s }
