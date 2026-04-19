// Package erp defines the enterprise ERP integration interface.
// Phase 4 scaffolding — real implementations live behind environment flags.
package erp

import (
	"context"
	"errors"
	"fmt"

	"github.com/upkeep/api/internal/config"
)

// WorkOrder is the cross-ERP shape Upkeep synchronizes.
type WorkOrder struct {
	ExternalID  string
	Reference   string
	MachineID   string
	Description string
	Status      string
	OpenedAt    string
	ClosedAt    string
}

// Adapter is the narrow interface every ERP integration implements.
type Adapter interface {
	Name() string
	CreateWorkOrder(ctx context.Context, orgID string, wo WorkOrder) (string, error)
	SyncInventory(ctx context.Context, orgID string) error
}

// New returns the configured adapter. The default is a no-op stub that records
// calls to logs so end-to-end flows work without an ERP connection.
func New(cfg config.Config) Adapter {
	switch cfg.ERPAdapter {
	case "sap":
		return &stubAdapter{name: "sap", todo: "TODO(deploy): implement SAP S/4HANA OData PUT /A_MaintenanceOrder — auth via client cert"}
	case "oracle":
		return &stubAdapter{name: "oracle-ebs", todo: "TODO(deploy): implement Oracle EBS REST /rest/latest/maintenanceWorkOrders"}
	case "epicor":
		return &stubAdapter{name: "epicor", todo: "TODO(deploy): implement Epicor Kinetic REST /api/v2/odata/<company>/Erp.BO.JobEntrySvc"}
	default:
		return &stubAdapter{name: "stub"}
	}
}

type stubAdapter struct {
	name string
	todo string
}

func (s *stubAdapter) Name() string { return s.name }

func (s *stubAdapter) CreateWorkOrder(_ context.Context, _ string, wo WorkOrder) (string, error) {
	if s.todo != "" {
		return "", fmt.Errorf("erp adapter %q not yet implemented: %s", s.name, s.todo)
	}
	return "stub-" + wo.Reference, nil
}

func (s *stubAdapter) SyncInventory(_ context.Context, _ string) error {
	if s.todo != "" {
		return errors.New(s.todo)
	}
	return nil
}
