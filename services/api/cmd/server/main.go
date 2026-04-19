package main

import (
	"context"
	"errors"
	"fmt"
	"log/slog"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/upkeep/api/internal/ai"
	"github.com/upkeep/api/internal/auth"
	"github.com/upkeep/api/internal/config"
	"github.com/upkeep/api/internal/docai"
	"github.com/upkeep/api/internal/firebase"
	"github.com/upkeep/api/internal/http/server"
	"github.com/upkeep/api/internal/vectorsearch"
)

func main() {
	logger := slog.New(slog.NewJSONHandler(os.Stdout, &slog.HandlerOptions{Level: slog.LevelInfo}))
	slog.SetDefault(logger)

	cfg, err := config.Load()
	if err != nil {
		slog.Error("config load failed", "err", err)
		os.Exit(1)
	}
	slog.Info("starting upkeep-api",
		"env", cfg.Env,
		"project", cfg.ProjectID,
		"vector", cfg.VectorBackend,
		"ai_mode", cfg.AIMode(),
	)

	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	fb, err := firebase.New(ctx, cfg)
	if err != nil {
		slog.Error("firebase init failed", "err", err)
		os.Exit(1)
	}
	defer fb.Close()

	aiClient := ai.New(ctx, cfg)
	docClient := docai.New(ctx, cfg)
	vstore, err := vectorsearch.New(ctx, cfg, fb.Firestore)
	if err != nil {
		slog.Error("vector store init failed", "err", err)
		os.Exit(1)
	}

	verifier := auth.NewVerifier(fb.Auth)

	router := server.NewRouter(server.Deps{
		Config:      cfg,
		Firestore:   fb.Firestore,
		Auth:        fb.Auth,
		Verifier:    verifier,
		AI:          aiClient,
		DocAI:       docClient,
		VectorStore: vstore,
	})

	addr := fmt.Sprintf(":%s", cfg.Port)
	srv := &http.Server{
		Addr:              addr,
		Handler:           router,
		ReadHeaderTimeout: 10 * time.Second,
		ReadTimeout:       60 * time.Second,
		WriteTimeout:      300 * time.Second,
		IdleTimeout:       120 * time.Second,
	}

	go func() {
		slog.Info("listening", "addr", addr)
		if err := srv.ListenAndServe(); err != nil && !errors.Is(err, http.ErrServerClosed) {
			slog.Error("server error", "err", err)
			cancel()
		}
	}()

	stop := make(chan os.Signal, 1)
	signal.Notify(stop, syscall.SIGINT, syscall.SIGTERM)
	select {
	case <-stop:
		slog.Info("shutdown signal received")
	case <-ctx.Done():
	}

	shutdownCtx, shutdownCancel := context.WithTimeout(context.Background(), 20*time.Second)
	defer shutdownCancel()
	if err := srv.Shutdown(shutdownCtx); err != nil {
		slog.Error("graceful shutdown failed", "err", err)
	}
	slog.Info("goodbye")
}
