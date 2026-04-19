package firebase

import (
	"context"
	"fmt"

	"cloud.google.com/go/firestore"
	fb "firebase.google.com/go/v4"
	fbauth "firebase.google.com/go/v4/auth"
	"google.golang.org/api/option"

	"github.com/upkeep/api/internal/config"
)

type Client struct {
	App       *fb.App
	Auth      *fbauth.Client
	Firestore *firestore.Client
}

func New(ctx context.Context, cfg config.Config) (*Client, error) {
	opts := []option.ClientOption{}
	conf := &fb.Config{ProjectID: cfg.FirebaseProjectID}
	app, err := fb.NewApp(ctx, conf, opts...)
	if err != nil {
		return nil, fmt.Errorf("init firebase app: %w", err)
	}
	authClient, err := app.Auth(ctx)
	if err != nil {
		return nil, fmt.Errorf("init firebase auth: %w", err)
	}
	fs, err := firestore.NewClient(ctx, cfg.FirebaseProjectID)
	if err != nil {
		return nil, fmt.Errorf("init firestore: %w", err)
	}
	return &Client{App: app, Auth: authClient, Firestore: fs}, nil
}

func (c *Client) Close() error {
	if c == nil || c.Firestore == nil {
		return nil
	}
	return c.Firestore.Close()
}
