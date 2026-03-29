export type MachineStatus = "active" | "idle" | "maintenance" | "down";

export interface Machine {
  id: string;
  shopId: string;
  manufacturer: string;
  model: string;
  nickname?: string;
  serialNumber?: string;
  status: MachineStatus;
  tags: string[];
  notes?: string;
  manualIds: string[];
  createdAt: string;
  updatedAt: string;
}

export type ManualStatus = "pending" | "indexed" | "failed";

export interface ManualChunkInput {
  content: string;
  pageNumber?: number;
  partNumbers?: string[];
}

export interface ManualChunk {
  id: string;
  manualId: string;
  chunkIndex: number;
  pageNumber?: number;
  content: string;
  partNumbers: string[];
  createdAt: string;
}

export interface Manual {
  id: string;
  machineId: string;
  title: string;
  filename: string;
  sourceUrl?: string;
  pages?: number;
  status: ManualStatus;
  chunkCount: number;
  createdAt: string;
  indexedAt?: string;
  notes?: string;
}

export interface MaintenanceLog {
  id: string;
  machineId: string;
  issue: string;
  resolution: string;
  partNumbers: string[];
  sourceManualIds: string[];
  createdAt: string;
  createdBy?: string;
}

export interface PartVendorLink {
  vendor: "mcmaster" | "grainger";
  searchUrl: string;
}

export interface PartSuggestion {
  label: string;
  reason: string;
  vendorLinks: PartVendorLink[];
}

export interface ChatSource {
  manualId: string;
  manualTitle: string;
  chunkId: string;
  pageNumber?: number;
  excerpt: string;
  score: number;
}

export interface ChatDraftLog {
  machineId: string;
  issue: string;
  resolution: string;
  partNumbers: string[];
  sourceManualIds: string[];
}

export interface ChatResult {
  machine: Machine | null;
  answer: string;
  confidence: number;
  sources: ChatSource[];
  partSuggestions: PartSuggestion[];
  relatedLogs: MaintenanceLog[];
  logDraft: ChatDraftLog;
  modeUsed: "demo" | "claude";
}

export interface ChatRequestBody {
  question?: string;
  machineId?: string;
  manualIds?: string[];
  limit?: number;
}

export interface MachineListOptions {
  query?: string;
  shopId?: string;
  status?: MachineStatus;
  manualId?: string;
  tags?: string[];
  limit?: number;
}

export interface ManualListOptions {
  query?: string;
  machineId?: string;
  manualIds?: string[];
  status?: ManualStatus;
  limit?: number;
}

export interface LogListOptions {
  query?: string;
  machineId?: string;
  sourceManualId?: string;
  limit?: number;
}

export interface MachineInput {
  shopId: string;
  manufacturer: string;
  model: string;
  nickname?: string;
  serialNumber?: string;
  status?: MachineStatus;
  tags?: string[];
  notes?: string;
}

export interface MachinePatch {
  shopId?: string;
  manufacturer?: string;
  model?: string;
  nickname?: string;
  serialNumber?: string;
  status?: MachineStatus;
  tags?: string[];
  notes?: string;
}

export interface ManualCreateInput {
  machineId: string;
  title: string;
  filename: string;
  sourceUrl?: string;
  pages?: number;
  notes?: string;
  sourceText?: string;
  chunks?: ManualChunkInput[];
}

export interface LogCreateInput {
  machineId: string;
  issue: string;
  resolution: string;
  partNumbers?: string[];
  sourceManualIds?: string[];
  createdBy?: string;
}

export interface StoreSnapshot {
  machines: Machine[];
  manuals: Manual[];
  chunks: ManualChunk[];
  logs: MaintenanceLog[];
  counters: {
    machine: number;
    manual: number;
    chunk: number;
    log: number;
  };
}

export interface RankedChunk {
  chunk: ManualChunk;
  manual: Manual;
  score: number;
}
