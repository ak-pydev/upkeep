// Upkeep shared domain types.
// Mirrors the Go structs in services/api/internal/* and the Firestore schema.
// Kept intentionally small and hand-maintained — no codegen.

export type Role = 'owner' | 'supervisor' | 'technician';

export interface Org {
  id: string;
  name: string;
  createdAt: string; // ISO
  plan: 'starter' | 'pro' | 'shop' | 'trial';
  ssoEnabled: boolean;
}

export interface Member {
  uid: string;
  email: string;
  displayName?: string;
  role: Role;
  joinedAt: string;
}

export interface Machine {
  id: string;
  orgId: string;
  name: string;
  make: string;        // e.g. "Haas"
  model: string;       // e.g. "VF-2"
  serialNumber?: string;
  installedAt?: string;
  hoursRun: number;
  nextServiceHours?: number;
  photoUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export type ManualSource = 'oem' | 'internal';

export interface Manual {
  id: string;
  orgId: string;
  machineId?: string;    // optional — a manual can be org-level (internal SOP)
  title: string;
  source: ManualSource;  // 'oem' or 'internal' (custom KB)
  pageCount: number;
  storagePath?: string;  // Cloud Storage GCS path
  status: 'uploaded' | 'parsing' | 'indexed' | 'failed';
  error?: string;
  uploadedBy: string;
  uploadedAt: string;
  indexedAt?: string;
}

export interface ManualChunk {
  id: string;
  orgId: string;
  manualId: string;
  machineId?: string;
  chunkIndex: number;
  page: number;
  text: string;
  embedding?: number[]; // only returned on debug endpoints
}

export interface Citation {
  manualId: string;
  manualTitle: string;
  page: number;
  snippet: string;
}

export interface PartReference {
  partNumber: string;
  description?: string;
  mcmasterUrl?: string;
  graingerUrl?: string;
}

export type MessageRole = 'user' | 'assistant' | 'system';

export interface ChatMessage {
  id: string;
  threadId: string;
  role: MessageRole;
  text: string;
  citations?: Citation[];
  parts?: PartReference[];
  imageUrls?: string[];
  createdAt: string;
}

export interface Thread {
  id: string;
  orgId: string;
  machineId?: string;
  title: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export type TicketStatus = 'open' | 'in_progress' | 'awaiting_parts' | 'resolved' | 'closed';
export type TicketPriority = 'low' | 'normal' | 'high' | 'critical';

export interface Ticket {
  id: string;
  orgId: string;
  machineId: string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  reporterUid: string;
  assigneeUid?: string;
  parts?: PartReference[];
  threadId?: string;        // link back to the chat that spawned it
  openedAt: string;
  resolvedAt?: string;
  closedAt?: string;
  mttrMinutes?: number;     // computed on close
}

export interface MaintenanceLogEntry {
  id: string;
  orgId: string;
  machineId: string;
  title: string;
  issue: string;
  resolution: string;
  parts?: PartReference[];
  technicianUid: string;
  ticketId?: string;
  threadId?: string;
  occurredAt: string;
  createdAt: string;
}

export type AlertStatus = 'pending' | 'acknowledged' | 'snoozed' | 'dismissed';

export interface Alert {
  id: string;
  orgId: string;
  machineId: string;
  kind: 'service_due' | 'hours_threshold' | 'recurring_issue';
  title: string;
  detail: string;
  dueAt: string;
  status: AlertStatus;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  orgId: string;
  actorUid: string;
  action: string;          // e.g. "ticket.create"
  target: string;          // e.g. "tickets/abc"
  meta?: Record<string, unknown>;
  at: string;
}

// ---- API request / response DTOs ----

export interface ChatAskRequest {
  orgId: string;
  machineId?: string;
  threadId?: string;
  question: string;
  imageUrls?: string[];
}

export interface ChatAskResponse {
  threadId: string;
  message: ChatMessage;
}

export interface UploadManualRequest {
  orgId: string;
  machineId?: string;
  title: string;
  source: ManualSource;
  // file delivered multipart; this is just metadata
}

export interface MttrStats {
  orgId: string;
  windowDays: number;
  avgMttrMinutes: number;
  medianMttrMinutes: number;
  ticketCount: number;
  byMachine: { machineId: string; machineName: string; avgMttrMinutes: number; count: number }[];
}
