package handlers

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"strings"
	"time"

	"github.com/upkeep/api/internal/ai"
	"github.com/upkeep/api/internal/config"
	"github.com/upkeep/api/internal/http/httpx"
)

type PartsHandler struct {
	ai         ai.Client
	cfg        config.Config
	httpClient *http.Client
}

func NewPartsHandler(a ai.Client, cfg config.Config) *PartsHandler {
	return &PartsHandler{
		ai:  a,
		cfg: cfg,
		httpClient: &http.Client{
			Timeout: 45 * time.Second,
		},
	}
}

type partLookup struct {
	PartNumber  string `json:"partNumber"`
	Description string `json:"description,omitempty"`
	McMasterURL string `json:"mcmasterUrl"`
	GraingerURL string `json:"graingerUrl"`
	Price       string `json:"price,omitempty"`
	InStock     *bool  `json:"inStock,omitempty"`
	LeadTime    string `json:"leadTime,omitempty"`
}

type oxylabsResponse struct {
	Results []struct {
		Content    any    `json:"content"`
		URL        string `json:"url"`
		StatusCode int    `json:"status_code"`
	} `json:"results"`
}

// Lookup takes ?q=<part number or search terms> and returns vendor links. When
// PARTS_REAL_API=true and Oxylabs credentials are configured, Grainger results
// are enriched through Oxylabs Web Scraper API.
func (h *PartsHandler) Lookup(w http.ResponseWriter, r *http.Request) {
	q := r.URL.Query().Get("q")
	if q == "" {
		httpx.Error(w, http.StatusBadRequest, "bad_request", "q required")
		return
	}

	// extract likely part numbers from free text
	parts, _ := h.ai.ExtractParts(r.Context(), q)
	if len(parts) == 0 {
		// fall back: treat whole query as one "part number"
		parts = []ai.PartRef{{PartNumber: q}}
	}

	out := make([]partLookup, 0, len(parts))
	for _, p := range parts {
		entry := partLookup{
			PartNumber:  p.PartNumber,
			Description: p.Description,
			McMasterURL: "https://www.mcmaster.com/" + url.PathEscape(p.PartNumber),
			GraingerURL: "https://www.grainger.com/search?searchQuery=" + url.QueryEscape(p.PartNumber),
		}
		if h.cfg.PartsRealAPI {
			entry = h.enrichGrainger(r.Context(), entry)
		}
		out = append(out, entry)
	}
	httpx.JSON(w, http.StatusOK, map[string]any{"parts": out})
}

func (h *PartsHandler) enrichGrainger(ctx context.Context, entry partLookup) partLookup {
	if h.cfg.OxylabsUsername == "" || h.cfg.OxylabsPassword == "" {
		return entry
	}

	if enriched, ok := h.lookupGraingerProduct(ctx, entry); ok {
		return enriched
	}

	if enriched, ok := h.lookupGraingerSearch(ctx, entry); ok {
		return enriched
	}

	return entry
}

func (h *PartsHandler) lookupGraingerProduct(ctx context.Context, entry partLookup) (partLookup, bool) {
	if entry.PartNumber == "" {
		return entry, false
	}

	resp, err := h.oxylabsQuery(ctx, map[string]any{
		"source":     "grainger_product",
		"product_id": entry.PartNumber,
		"domain":     h.cfg.OxylabsGraingerDomain,
		"parse":      true,
	})
	if err != nil {
		return entry, false
	}

	return mergeGraingerData(entry, resp)
}

func (h *PartsHandler) lookupGraingerSearch(ctx context.Context, entry partLookup) (partLookup, bool) {
	query := strings.TrimSpace(entry.PartNumber + " " + entry.Description)
	if query == "" {
		query = entry.PartNumber
	}
	if query == "" {
		return entry, false
	}

	resp, err := h.oxylabsQuery(ctx, map[string]any{
		"source": "grainger_search",
		"query":  query,
		"domain": h.cfg.OxylabsGraingerDomain,
		"parse":  true,
	})
	if err != nil {
		return entry, false
	}

	return mergeGraingerData(entry, resp)
}

func (h *PartsHandler) oxylabsQuery(ctx context.Context, payload map[string]any) (oxylabsResponse, error) {
	var out oxylabsResponse

	body, err := json.Marshal(payload)
	if err != nil {
		return out, fmt.Errorf("marshal oxylabs payload: %w", err)
	}

	req, err := http.NewRequestWithContext(ctx, http.MethodPost, "https://realtime.oxylabs.io/v1/queries", bytes.NewReader(body))
	if err != nil {
		return out, fmt.Errorf("create oxylabs request: %w", err)
	}
	req.SetBasicAuth(h.cfg.OxylabsUsername, h.cfg.OxylabsPassword)
	req.Header.Set("Content-Type", "application/json")

	res, err := h.httpClient.Do(req)
	if err != nil {
		return out, fmt.Errorf("send oxylabs request: %w", err)
	}
	defer res.Body.Close()

	payloadBody, err := io.ReadAll(io.LimitReader(res.Body, 2<<20))
	if err != nil {
		return out, fmt.Errorf("read oxylabs response: %w", err)
	}
	if res.StatusCode >= http.StatusBadRequest {
		return out, fmt.Errorf("oxylabs status %d", res.StatusCode)
	}
	if err := json.Unmarshal(payloadBody, &out); err != nil {
		return out, fmt.Errorf("decode oxylabs response: %w", err)
	}
	if len(out.Results) == 0 {
		return out, fmt.Errorf("oxylabs returned no results")
	}

	return out, nil
}

func mergeGraingerData(entry partLookup, resp oxylabsResponse) (partLookup, bool) {
	result := resp.Results[0]
	if result.Content == nil {
		return entry, false
	}

	if entry.Description == "" {
		entry.Description = findFirstString(result.Content, "title", "name", "product_name", "description")
	}
	if url := findFirstString(result.Content, "product_url", "canonical_url", "url", "link"); url != "" {
		entry.GraingerURL = url
	} else if result.URL != "" {
		entry.GraingerURL = result.URL
	}
	if price := findFirstString(result.Content, "price", "price_text", "display_price", "current_price", "sale_price"); price != "" {
		entry.Price = price
	}
	if stock, ok := findFirstBool(result.Content, "in_stock", "is_in_stock", "available", "availability"); ok {
		entry.InStock = &stock
	}
	if leadTime := findFirstString(result.Content, "lead_time", "shipping", "delivery", "availability_message"); leadTime != "" {
		entry.LeadTime = leadTime
	}

	return entry, entry.GraingerURL != ""
}

func findFirstString(v any, keys ...string) string {
	switch value := v.(type) {
	case map[string]any:
		for _, key := range keys {
			if raw, ok := value[key]; ok {
				switch typed := raw.(type) {
				case string:
					if strings.TrimSpace(typed) != "" {
						return typed
					}
				case fmt.Stringer:
					if text := strings.TrimSpace(typed.String()); text != "" {
						return text
					}
				}
			}
		}
		for _, child := range value {
			if found := findFirstString(child, keys...); found != "" {
				return found
			}
		}
	case []any:
		for _, child := range value {
			if found := findFirstString(child, keys...); found != "" {
				return found
			}
		}
	}

	return ""
}

func findFirstBool(v any, keys ...string) (bool, bool) {
	switch value := v.(type) {
	case map[string]any:
		for _, key := range keys {
			if raw, ok := value[key]; ok {
				switch typed := raw.(type) {
				case bool:
					return typed, true
				case string:
					lower := strings.ToLower(strings.TrimSpace(typed))
					switch lower {
					case "in stock", "available", "true", "yes":
						return true, true
					case "out of stock", "unavailable", "false", "no":
						return false, true
					}
				}
			}
		}
		for _, child := range value {
			if found, ok := findFirstBool(child, keys...); ok {
				return found, true
			}
		}
	case []any:
		for _, child := range value {
			if found, ok := findFirstBool(child, keys...); ok {
				return found, true
			}
		}
	}

	return false, false
}
