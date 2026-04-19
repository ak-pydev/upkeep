package config

import (
	"errors"
	"os"
	"strings"
)

type Env string

const (
	EnvDev     Env = "dev"
	EnvStaging Env = "staging"
	EnvProd    Env = "prod"
)

type Config struct {
	Env               Env
	Port              string
	ProjectID         string
	FirebaseProjectID string

	GeminiAPIKey string

	DocAIProcessorID string
	DocAILocation    string

	VectorBackend         string // "firestore" | "vertex"
	VertexIndexEndpointID string
	VertexDeployedIndexID string
	VertexRegion          string

	McMasterAPIKey        string
	GraingerAPIKey        string
	OxylabsUsername       string
	OxylabsPassword       string
	OxylabsGraingerDomain string
	PartsRealAPI          bool

	ERPAdapter string // "stub" | "sap" | "oracle" | "epicor"

	AllowedOrigins []string
}

// AIMode returns "live" if a real Gemini key is configured, else "stub".
func (c Config) AIMode() string {
	if c.GeminiAPIKey == "" {
		return "stub"
	}
	return "live"
}

// DocAIMode returns "live" only when a processor ID is configured.
func (c Config) DocAIMode() string {
	if c.DocAIProcessorID == "" {
		return "stub"
	}
	return "live"
}

func Load() (Config, error) {
	c := Config{
		Env:                   Env(getenv("UPKEEP_ENV", "dev")),
		Port:                  getenv("PORT", "8080"),
		ProjectID:             os.Getenv("GOOGLE_CLOUD_PROJECT"),
		FirebaseProjectID:     os.Getenv("FIREBASE_PROJECT_ID"),
		GeminiAPIKey:          os.Getenv("GEMINI_API_KEY"),
		DocAIProcessorID:      os.Getenv("DOC_AI_PROCESSOR_ID"),
		DocAILocation:         getenv("DOC_AI_LOCATION", "us"),
		VectorBackend:         getenv("VECTOR_BACKEND", "firestore"),
		VertexIndexEndpointID: os.Getenv("VERTEX_INDEX_ENDPOINT_ID"),
		VertexDeployedIndexID: os.Getenv("VERTEX_DEPLOYED_INDEX_ID"),
		VertexRegion:          getenv("VERTEX_REGION", "us-central1"),
		McMasterAPIKey:        os.Getenv("MCMASTER_API_KEY"),
		GraingerAPIKey:        os.Getenv("GRAINGER_API_KEY"),
		OxylabsUsername:       os.Getenv("OXYLABS_USERNAME"),
		OxylabsPassword:       os.Getenv("OXYLABS_PASSWORD"),
		OxylabsGraingerDomain: getenv("OXYLABS_GRAINGER_DOMAIN", "com"),
		PartsRealAPI:          strings.EqualFold(os.Getenv("PARTS_REAL_API"), "true"),
		ERPAdapter:            getenv("ERP_ADAPTER", "stub"),
		AllowedOrigins:        splitCSV(getenv("ALLOWED_ORIGINS", "http://localhost:4200,http://localhost:5000")),
	}
	if c.ProjectID == "" {
		return c, errors.New("GOOGLE_CLOUD_PROJECT is required")
	}
	if c.FirebaseProjectID == "" {
		c.FirebaseProjectID = c.ProjectID
	}
	if c.Env != EnvDev && os.Getenv("INTERNAL_TOKEN") == "" {
		return c, errors.New("INTERNAL_TOKEN is required outside dev")
	}
	return c, nil
}

func getenv(key, def string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return def
}

func splitCSV(s string) []string {
	parts := strings.Split(s, ",")
	out := make([]string, 0, len(parts))
	for _, p := range parts {
		p = strings.TrimSpace(p)
		if p != "" {
			out = append(out, p)
		}
	}
	return out
}
