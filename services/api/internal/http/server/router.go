package server

import (
	"encoding/json"
	"log/slog"
	"net/http"
	"time"

	"cloud.google.com/go/firestore"
	fbauth "firebase.google.com/go/v4/auth"
	"github.com/go-chi/chi/v5"
	chimiddleware "github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"

	"github.com/upkeep/api/internal/ai"
	"github.com/upkeep/api/internal/auth"
	"github.com/upkeep/api/internal/config"
	"github.com/upkeep/api/internal/docai"
	"github.com/upkeep/api/internal/http/handlers"
	"github.com/upkeep/api/internal/middleware"
	"github.com/upkeep/api/internal/vectorsearch"
)

type Deps struct {
	Config      config.Config
	Firestore   *firestore.Client
	Auth        *fbauth.Client
	Verifier    *auth.Verifier
	AI          ai.Client
	DocAI       docai.Client
	VectorStore vectorsearch.Store
}

func NewRouter(d Deps) http.Handler {
	r := chi.NewRouter()
	r.Use(chimiddleware.RealIP)
	r.Use(chimiddleware.RequestID)
	r.Use(middleware.Logger)
	r.Use(chimiddleware.Recoverer)
	r.Use(chimiddleware.Timeout(90 * time.Second))
	r.Use(cors.Handler(cors.Options{
		AllowedOrigins:   d.Config.AllowedOrigins,
		AllowedMethods:   []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Authorization", "Content-Type", "X-Requested-With"},
		AllowCredentials: true,
		MaxAge:           300,
	}))

	// Public endpoints
	r.Get("/healthz", func(w http.ResponseWriter, _ *http.Request) {
		respondJSON(w, http.StatusOK, map[string]any{
			"ok":      true,
			"env":     string(d.Config.Env),
			"ai":      d.Config.AIMode(),
			"docai":   d.Config.DocAIMode(),
			"vector":  d.Config.VectorBackend,
			"version": "0.1.0",
		})
	})

	// Authenticated routes
	auth := middleware.RequireAuth(d.Verifier)

	chat := handlers.NewChatHandler(d.Firestore, d.AI, d.VectorStore, d.Config)
	manuals := handlers.NewManualsHandler(d.Firestore, d.DocAI, d.AI, d.VectorStore, d.Config)
	tickets := handlers.NewTicketsHandler(d.Firestore, d.Config)
	logs := handlers.NewLogsHandler(d.Firestore, d.Config)
	machines := handlers.NewMachinesHandler(d.Firestore, d.Config)
	alerts := handlers.NewAlertsHandler(d.Firestore, d.Config)
	parts := handlers.NewPartsHandler(d.AI, d.Config)
	analytics := handlers.NewAnalyticsHandler(d.Firestore)
	orgs := handlers.NewOrgsHandler(d.Firestore, d.Verifier)

	r.Group(func(r chi.Router) {
		r.Use(auth)

		r.Post("/v1/orgs", orgs.Create)
		r.Get("/v1/orgs/me", orgs.Me)
		r.Post("/v1/orgs/{orgId}/members", orgs.AddMember)

		r.Get("/v1/machines", machines.List)
		r.Post("/v1/machines", machines.Create)
		r.Get("/v1/machines/{id}", machines.Get)
		r.Patch("/v1/machines/{id}", machines.Update)
		r.Delete("/v1/machines/{id}", machines.Delete)

		r.Get("/v1/manuals", manuals.List)
		r.Post("/v1/manuals", manuals.Upload)
		r.Get("/v1/manuals/{id}", manuals.Get)
		r.Delete("/v1/manuals/{id}", manuals.Delete)

		r.Post("/v1/chat/ask", chat.Ask)
		r.Get("/v1/chat/threads", chat.ListThreads)
		r.Get("/v1/chat/threads/{id}", chat.GetThread)

		r.Get("/v1/tickets", tickets.List)
		r.Post("/v1/tickets", tickets.Create)
		r.Get("/v1/tickets/{id}", tickets.Get)
		r.Patch("/v1/tickets/{id}", tickets.Update)
		r.Post("/v1/tickets/{id}/close", tickets.Close)

		r.Get("/v1/maintenance-log", logs.List)
		r.Post("/v1/maintenance-log", logs.Create)
		r.Get("/v1/maintenance-log/search", logs.Search)

		r.Get("/v1/alerts", alerts.List)
		r.Post("/v1/alerts/{id}/ack", alerts.Ack)
		r.Post("/v1/alerts/{id}/dismiss", alerts.Dismiss)

		r.Get("/v1/parts/lookup", parts.Lookup)

		r.Get("/v1/analytics/mttr", analytics.MTTR)
		r.Get("/v1/analytics/downtime", analytics.Downtime)
	})

	// Internal endpoints (called by Cloud Scheduler → Cloud Run jobs, service-auth'd)
	r.Group(func(r chi.Router) {
		r.Use(middleware.RequireInternalAuth(d.Config))
		r.Post("/internal/alerts/scan", handlers.NewInternalAlertsHandler(d.Firestore).Scan)
	})

	slog.Info("router configured")
	return r
}

func respondJSON(w http.ResponseWriter, status int, body any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(body)
}
