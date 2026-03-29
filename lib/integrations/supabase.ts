import type { Manual, ManualChunk, MaintenanceLog, Machine } from "@/lib/upkeep/types";

export interface SupabaseConfig {
  url: string;
  serviceRoleKey: string;
}

export function getSupabaseConfig(): SupabaseConfig | null {
  const url = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    return null;
  }

  return { url, serviceRoleKey };
}

export function isSupabaseConfigured() {
  return getSupabaseConfig() !== null;
}

export interface ManualVectorRow {
  manual_id: string;
  machine_id: string;
  chunk_id: string;
  chunk_index: number;
  content: string;
  page_number?: number;
  metadata: Record<string, unknown>;
}

export function toManualVectorRows(manual: Manual, chunks: ManualChunk[]): ManualVectorRow[] {
  return chunks.map((chunk) => ({
    manual_id: manual.id,
    machine_id: manual.machineId,
    chunk_id: chunk.id,
    chunk_index: chunk.chunkIndex,
    content: chunk.content,
    page_number: chunk.pageNumber,
    metadata: {
      title: manual.title,
      filename: manual.filename,
      partNumbers: chunk.partNumbers
    }
  }));
}

export interface MaintenanceLogRow {
  id: string;
  machine_id: string;
  issue: string;
  resolution: string;
  part_numbers: string[];
  source_manual_ids: string[];
  created_by?: string;
  created_at: string;
}

export function toMaintenanceLogRow(log: MaintenanceLog): MaintenanceLogRow {
  return {
    id: log.id,
    machine_id: log.machineId,
    issue: log.issue,
    resolution: log.resolution,
    part_numbers: log.partNumbers,
    source_manual_ids: log.sourceManualIds,
    created_by: log.createdBy,
    created_at: log.createdAt
  };
}

export interface MachineRow {
  id: string;
  shop_id: string;
  manufacturer: string;
  model: string;
  nickname?: string;
  serial_number?: string;
  status: string;
  tags: string[];
  notes?: string;
  manual_ids: string[];
  created_at: string;
  updated_at: string;
}

export function toMachineRow(machine: Machine): MachineRow {
  return {
    id: machine.id,
    shop_id: machine.shopId,
    manufacturer: machine.manufacturer,
    model: machine.model,
    nickname: machine.nickname,
    serial_number: machine.serialNumber,
    status: machine.status,
    tags: machine.tags,
    notes: machine.notes,
    manual_ids: machine.manualIds,
    created_at: machine.createdAt,
    updated_at: machine.updatedAt
  };
}

export interface SupabaseBoundarySummary {
  configured: boolean;
  note: string;
}

export function getSupabaseBoundarySummary(): SupabaseBoundarySummary {
  return {
    configured: isSupabaseConfigured(),
    note:
      "Demo mode uses the in-memory store. Swap the write helpers in lib/upkeep/store.ts with these row mappers when Supabase is configured."
  };
}

