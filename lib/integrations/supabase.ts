import { embedText, toPgvectorLiteral } from "@/lib/upkeep/embeddings";
import type { Manual, ManualChunk, MaintenanceLog, Machine } from "@/lib/upkeep/types";

export interface SupabaseConfig {
  url: string;
  apiKey: string;
  authSource: "service_role" | "anon";
  urlSource: "SUPABASE_URL" | "SUPABASE_URI";
}

function readEnv(...keys: string[]) {
  for (const key of keys) {
    const value = process.env[key];
    if (value?.trim()) {
      return {
        key,
        value: value.trim()
      };
    }
  }

  return null;
}

export function getSupabaseConfig(): SupabaseConfig | null {
  const urlEntry = readEnv("SUPABASE_URL", "SUPABASE_URI");
  const apiKeyEntry = readEnv(
    "SUPABASE_SERVICE_ROLE_KEY",
    "SUPABASE_ANON_KEY",
    "SUPABASE_ANNON_KEY"
  );

  if (!urlEntry || !apiKeyEntry) {
    return null;
  }

  return {
    url: urlEntry.value,
    apiKey: apiKeyEntry.value,
    authSource:
      apiKeyEntry.key === "SUPABASE_SERVICE_ROLE_KEY" ? "service_role" : "anon",
    urlSource:
      urlEntry.key === "SUPABASE_URL" ? "SUPABASE_URL" : "SUPABASE_URI"
  };
}

export function isSupabaseConfigured() {
  return getSupabaseConfig() !== null;
}

function buildUrl(path: string, params?: Record<string, string | undefined>) {
  const config = getSupabaseConfig();
  if (!config) {
    throw new Error("Supabase is not configured");
  }

  const url = new URL(`/rest/v1/${path}`, config.url);
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value) {
        url.searchParams.set(key, value);
      }
    }
  }

  return url;
}

async function supabaseRequest<T>(
  path: string,
  init?: RequestInit,
  params?: Record<string, string | undefined>
) {
  const config = getSupabaseConfig();
  if (!config) {
    throw new Error("Supabase is not configured");
  }

  const response = await fetch(buildUrl(path, params), {
    ...init,
    headers: {
      apikey: config.apiKey,
      Authorization: `Bearer ${config.apiKey}`,
      "Content-Type": "application/json",
      ...(init?.headers ?? {})
    },
    cache: "no-store"
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Supabase request failed: ${response.status} ${message}`);
  }

  if (response.status === 204) {
    return null as T;
  }

  return (await response.json()) as T;
}

async function supabaseRpc<T>(name: string, body: Record<string, unknown>) {
  return supabaseRequest<T>(`rpc/${name}`, {
    method: "POST",
    headers: {
      Prefer: "return=representation"
    },
    body: JSON.stringify(body)
  });
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

export interface ManualRow {
  id: string;
  machine_id: string;
  title: string;
  filename: string;
  source_url?: string;
  pages?: number;
  status: string;
  chunk_count: number;
  notes?: string;
  created_at: string;
  indexed_at?: string;
}

export interface ManualChunkRow {
  id: string;
  manual_id: string;
  chunk_index: number;
  page_number?: number;
  content: string;
  part_numbers: string[];
  embedding?: string;
  metadata?: Record<string, unknown>;
  created_at: string;
}

export interface MatchedManualChunkRow extends ManualChunkRow {
  similarity: number;
}

export function toManualVectorRows(
  manual: Manual,
  chunks: ManualChunk[]
): ManualVectorRow[] {
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

export function toManualRow(manual: Manual): ManualRow {
  return {
    id: manual.id,
    machine_id: manual.machineId,
    title: manual.title,
    filename: manual.filename,
    source_url: manual.sourceUrl,
    pages: manual.pages,
    status: manual.status,
    chunk_count: manual.chunkCount,
    notes: manual.notes,
    created_at: manual.createdAt,
    indexed_at: manual.indexedAt
  };
}

export function toManualChunkRows(chunks: ManualChunk[]): ManualChunkRow[] {
  return chunks.map((chunk) => ({
    id: chunk.id,
    manual_id: chunk.manualId,
    chunk_index: chunk.chunkIndex,
    page_number: chunk.pageNumber,
    content: chunk.content,
    part_numbers: chunk.partNumbers,
    embedding: toPgvectorLiteral(embedText(`${chunk.content} ${chunk.partNumbers.join(" ")}`.trim())),
    created_at: chunk.createdAt
  }));
}

export function fromMachineRow(row: MachineRow): Machine {
  return {
    id: row.id,
    shopId: row.shop_id,
    manufacturer: row.manufacturer,
    model: row.model,
    nickname: row.nickname,
    serialNumber: row.serial_number,
    status: row.status as Machine["status"],
    tags: row.tags ?? [],
    notes: row.notes,
    manualIds: row.manual_ids ?? [],
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

export function fromManualRow(row: ManualRow): Manual {
  return {
    id: row.id,
    machineId: row.machine_id,
    title: row.title,
    filename: row.filename,
    sourceUrl: row.source_url,
    pages: row.pages,
    status: row.status as Manual["status"],
    chunkCount: row.chunk_count,
    notes: row.notes,
    createdAt: row.created_at,
    indexedAt: row.indexed_at
  };
}

export function fromManualChunkRow(row: ManualChunkRow): ManualChunk {
  return {
    id: row.id,
    manualId: row.manual_id,
    chunkIndex: row.chunk_index,
    pageNumber: row.page_number,
    content: row.content,
    partNumbers: row.part_numbers ?? [],
    createdAt: row.created_at
  };
}

export function fromMaintenanceLogRow(row: MaintenanceLogRow): MaintenanceLog {
  return {
    id: row.id,
    machineId: row.machine_id,
    issue: row.issue,
    resolution: row.resolution,
    partNumbers: row.part_numbers ?? [],
    sourceManualIds: row.source_manual_ids ?? [],
    createdBy: row.created_by,
    createdAt: row.created_at
  };
}

export async function fetchMachinesFromSupabase() {
  const rows = await supabaseRequest<MachineRow[]>("machines", undefined, {
    select: "*",
    order: "created_at.desc"
  });
  return rows.map(fromMachineRow);
}

export async function fetchManualsFromSupabase() {
  const rows = await supabaseRequest<ManualRow[]>("manuals", undefined, {
    select: "*",
    order: "created_at.desc"
  });
  return rows.map(fromManualRow);
}

export async function fetchManualChunksFromSupabase() {
  const rows = await supabaseRequest<ManualChunkRow[]>("manual_chunks", undefined, {
    select: "*",
    order: "chunk_index.asc"
  });
  return rows.map(fromManualChunkRow);
}

export async function fetchLogsFromSupabase() {
  const rows = await supabaseRequest<MaintenanceLogRow[]>(
    "maintenance_logs",
    undefined,
    {
      select: "*",
      order: "created_at.desc"
    }
  );
  return rows.map(fromMaintenanceLogRow);
}

export async function upsertMachineInSupabase(machine: Machine) {
  await supabaseRequest(
    "machines",
    {
      method: "POST",
      headers: {
        Prefer: "resolution=merge-duplicates,return=minimal"
      },
      body: JSON.stringify([toMachineRow(machine)])
    },
    {
      on_conflict: "id"
    }
  );
}

export async function insertManualInSupabase(manual: Manual, chunks: ManualChunk[]) {
  await supabaseRequest("manuals", {
    method: "POST",
    headers: {
      Prefer: "return=minimal"
    },
    body: JSON.stringify([toManualRow(manual)])
  });

  if (chunks.length > 0) {
    await supabaseRequest("manual_chunks", {
      method: "POST",
      headers: {
        Prefer: "return=minimal"
      },
      body: JSON.stringify(toManualChunkRows(chunks))
    });
  }
}

export async function insertLogInSupabase(log: MaintenanceLog) {
  await supabaseRequest("maintenance_logs", {
    method: "POST",
    headers: {
      Prefer: "return=minimal"
    },
    body: JSON.stringify([toMaintenanceLogRow(log)])
  });
}

export async function matchManualChunksByEmbedding(options: {
  query: string;
  machineId?: string;
  manualIds?: string[];
  limit?: number;
}) {
  const rows = await supabaseRpc<MatchedManualChunkRow[]>("match_manual_chunks", {
    query_embedding: toPgvectorLiteral(embedText(options.query)),
    match_count: options.limit ?? 5,
    filter_machine_id: options.machineId ?? null,
    filter_manual_ids: options.manualIds?.length ? options.manualIds : null
  });

  return rows.map((row) => ({
    chunk: fromManualChunkRow(row),
    similarity: row.similarity
  }));
}

export interface SupabaseBoundarySummary {
  configured: boolean;
  authSource?: "service_role" | "anon";
  urlSource?: "SUPABASE_URL" | "SUPABASE_URI";
  runtime?: "ready" | "degraded";
  note: string;
}

function classifySupabaseFailure(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  if (message.includes("PGRST205")) {
    return "Supabase is configured, but the required tables are missing. Run supabase/schema.sql in your project.";
  }
  if (message.includes("JWT") || message.includes("permission") || message.includes("401") || message.includes("403")) {
    return "Supabase credentials were accepted by the app, but the key does not have the permissions needed for this backend path.";
  }
  return `Supabase is configured but currently unavailable: ${message}`;
}

export async function checkSupabaseRuntime() {
  const config = getSupabaseConfig();
  if (!config) {
    return {
      configured: false,
      runtime: "degraded" as const,
      note: "Supabase is not configured for persistence yet."
    };
  }

  try {
    await supabaseRequest<MachineRow[]>("machines", undefined, {
      select: "id",
      limit: "1"
    });

    return {
      configured: true,
      runtime: "ready" as const,
      note:
        config.authSource === "service_role"
          ? "Supabase REST persistence is enabled."
          : "Supabase is configured with an anon key. Reads may work, but writes can fail if RLS blocks them."
    };
  } catch (error) {
    return {
      configured: true,
      runtime: "degraded" as const,
      note: classifySupabaseFailure(error)
    };
  }
}

export async function getSupabaseBoundarySummary(): Promise<SupabaseBoundarySummary> {
  const config = getSupabaseConfig();
  const runtime = await checkSupabaseRuntime();

  return {
    configured: Boolean(config),
    authSource: config?.authSource,
    urlSource: config?.urlSource,
    runtime: runtime.runtime,
    note: runtime.note
  };
}
