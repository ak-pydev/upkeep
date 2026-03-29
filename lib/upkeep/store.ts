import { chunkText } from "@/lib/upkeep/chunker";
import { createSeedSnapshot } from "@/lib/upkeep/seed";
import type {
  LogCreateInput,
  Machine,
  MachineInput,
  MachinePatch,
  Manual,
  ManualChunk,
  ManualChunkInput,
  ManualCreateInput,
  MaintenanceLog,
  RankedChunk,
  StoreSnapshot
} from "@/lib/upkeep/types";
import { rankLogs, rankMachines, rankChunks } from "@/lib/upkeep/search";
import { uniquePartLabels } from "@/lib/upkeep/parts";
import { isSupabaseConfigured } from "@/lib/integrations/supabase";

type StoreState = StoreSnapshot;

declare global {
  // eslint-disable-next-line no-var
  var __upkeepStore: StoreState | undefined;
}

function cloneMachine(machine: Machine): Machine {
  return {
    ...machine,
    tags: [...machine.tags],
    manualIds: [...machine.manualIds]
  };
}

function cloneManual(manual: Manual): Manual {
  return { ...manual };
}

function cloneChunk(chunk: ManualChunk): ManualChunk {
  return {
    ...chunk,
    partNumbers: [...chunk.partNumbers]
  };
}

function cloneLog(log: MaintenanceLog): MaintenanceLog {
  return {
    ...log,
    partNumbers: [...log.partNumbers],
    sourceManualIds: [...log.sourceManualIds]
  };
}

function nowIso() {
  return new Date().toISOString();
}

function createId(prefix: string, nextValue: number) {
  return `${prefix}_${nextValue}`;
}

function getState(): StoreState {
  if (!globalThis.__upkeepStore) {
    globalThis.__upkeepStore = createSeedSnapshot();
  }

  return globalThis.__upkeepStore;
}

function persistState(state: StoreState) {
  globalThis.__upkeepStore = state;
  return state;
}

function nextCounterKey(kind: keyof StoreState["counters"]) {
  const state = getState();
  state.counters[kind] += 1;
  return state.counters[kind];
}

function normalizeInputChunks(manualId: string, chunks: ManualChunkInput[]) {
  return chunks.map((chunk, index) => ({
    id: createId("chunk", nextCounterKey("chunk")),
    manualId,
    chunkIndex: index,
    pageNumber: chunk.pageNumber,
    content: chunk.content.trim(),
    partNumbers: uniquePartLabels(chunk.partNumbers ?? []),
    createdAt: nowIso()
  }));
}

function createChunksFromText(manualId: string, text?: string) {
  if (!text?.trim()) {
    return [];
  }

  return chunkText(text).map((content, index) => ({
    id: createId("chunk", nextCounterKey("chunk")),
    manualId,
    chunkIndex: index,
    content,
    partNumbers: [],
    createdAt: nowIso()
  }));
}

export function listMachines(options?: { query?: string }) {
  const state = getState();
  const machines = options?.query ? rankMachines(state.machines, options.query, state.machines.length) : [...state.machines];
  return machines.map(cloneMachine);
}

export function findMachineById(machineId: string) {
  const state = getState();
  const machine = state.machines.find((entry) => entry.id === machineId);
  return machine ? cloneMachine(machine) : null;
}

export function findMachinesByQuery(query: string, limit = 5) {
  return rankMachines(getState().machines, query, limit).map(cloneMachine);
}

export function createMachine(input: MachineInput) {
  const state = getState();
  const machine: Machine = {
    id: createId("machine", nextCounterKey("machine")),
    shopId: input.shopId,
    manufacturer: input.manufacturer,
    model: input.model,
    nickname: input.nickname,
    serialNumber: input.serialNumber,
    status: input.status ?? "active",
    tags: uniquePartLabels(input.tags ?? []),
    notes: input.notes,
    manualIds: [],
    createdAt: nowIso(),
    updatedAt: nowIso()
  };

  state.machines.unshift(machine);
  persistState(state);
  return cloneMachine(machine);
}

export function updateMachine(machineId: string, patch: MachinePatch) {
  const state = getState();
  const machine = state.machines.find((entry) => entry.id === machineId);
  if (!machine) {
    return null;
  }

  if (patch.shopId !== undefined) machine.shopId = patch.shopId;
  if (patch.manufacturer !== undefined) machine.manufacturer = patch.manufacturer;
  if (patch.model !== undefined) machine.model = patch.model;
  if (patch.nickname !== undefined) machine.nickname = patch.nickname;
  if (patch.serialNumber !== undefined) machine.serialNumber = patch.serialNumber;
  if (patch.status !== undefined) machine.status = patch.status;
  if (patch.tags !== undefined) machine.tags = uniquePartLabels(patch.tags);
  if (patch.notes !== undefined) machine.notes = patch.notes;
  machine.updatedAt = nowIso();

  persistState(state);
  return cloneMachine(machine);
}

export function listManuals(options?: { machineId?: string; manualIds?: string[] }) {
  const state = getState();
  const manualIds = options?.manualIds?.length ? new Set(options.manualIds) : null;
  const manuals = state.manuals.filter((manual) => {
    if (options?.machineId && manual.machineId !== options.machineId) {
      return false;
    }
    if (manualIds && !manualIds.has(manual.id)) {
      return false;
    }
    return true;
  });

  return manuals.map(cloneManual);
}

export function findManualById(manualId: string) {
  const state = getState();
  const manual = state.manuals.find((entry) => entry.id === manualId);
  return manual ? cloneManual(manual) : null;
}

export function listManualChunks(options?: { machineId?: string; manualIds?: string[] }) {
  const state = getState();
  const manualIds = options?.manualIds?.length ? new Set(options.manualIds) : null;
  const manualLookup = new Map(state.manuals.map((manual) => [manual.id, manual]));

  return state.chunks
    .filter((chunk) => {
      const manual = manualLookup.get(chunk.manualId);
      if (!manual) {
        return false;
      }
      if (options?.machineId && manual.machineId !== options.machineId) {
        return false;
      }
      if (manualIds && !manualIds.has(chunk.manualId)) {
        return false;
      }
      return true;
    })
    .map(cloneChunk);
}

export function createManual(input: ManualCreateInput) {
  const state = getState();
  const manualId = createId("manual", nextCounterKey("manual"));
  const manualChunks = input.chunks?.length
    ? normalizeInputChunks(manualId, input.chunks)
    : createChunksFromText(manualId, input.sourceText);
  const manual: Manual = {
    id: manualId,
    machineId: input.machineId,
    title: input.title,
    filename: input.filename,
    sourceUrl: input.sourceUrl,
    pages: input.pages,
    status: manualChunks.length > 0 ? "indexed" : "pending",
    chunkCount: manualChunks.length,
    createdAt: nowIso(),
    indexedAt: manualChunks.length > 0 ? nowIso() : undefined,
    notes: input.notes
  };

  state.manuals.unshift(manual);
  state.chunks.unshift(...manualChunks);

  const machine = state.machines.find((entry) => entry.id === input.machineId);
  if (machine && !machine.manualIds.includes(manual.id)) {
    machine.manualIds.unshift(manual.id);
    machine.updatedAt = nowIso();
  }

  persistState(state);

  if (isSupabaseConfigured()) {
    // Demo-first default. Wire the Supabase write path here when the service is enabled.
  }

  return {
    manual: cloneManual(manual),
    chunks: manualChunks.map(cloneChunk)
  };
}

export function createLog(input: LogCreateInput) {
  const state = getState();
  const log: MaintenanceLog = {
    id: createId("log", nextCounterKey("log")),
    machineId: input.machineId,
    issue: input.issue,
    resolution: input.resolution,
    partNumbers: uniquePartLabels(input.partNumbers ?? []),
    sourceManualIds: uniquePartLabels(input.sourceManualIds ?? []),
    createdBy: input.createdBy,
    createdAt: nowIso()
  };

  state.logs.unshift(log);
  persistState(state);

  if (isSupabaseConfigured()) {
    // Demo-first default. Wire the Supabase write path here when the service is enabled.
  }

  return cloneLog(log);
}

export function listLogs(options?: { machineId?: string; query?: string }) {
  const state = getState();
  const logs = options?.query
    ? rankLogs(options.query, state.logs, state.logs.length)
    : state.logs.filter((log) => !options?.machineId || log.machineId === options.machineId);

  return logs.map(cloneLog);
}

export function findLogById(logId: string) {
  const state = getState();
  const log = state.logs.find((entry) => entry.id === logId);
  return log ? cloneLog(log) : null;
}

export function searchChunksForQuestion(question: string, options?: { machineId?: string; manualIds?: string[]; limit?: number }) {
  const manuals = listManuals(options);
  const chunks = listManualChunks(options);
  if (manuals.length === 0 || chunks.length === 0) {
    return [];
  }
  const ranked: RankedChunk[] = chunks.map((chunk) => ({
    chunk,
    manual: manuals.find((manual) => manual.id === chunk.manualId) ?? manuals[0],
    score: 0
  })).filter((entry): entry is RankedChunk => Boolean(entry.manual));

  return rankChunks(question, ranked, options?.limit ?? 5);
}

export function getSeedCounts() {
  const state = getState();
  return {
    machines: state.machines.length,
    manuals: state.manuals.length,
    chunks: state.chunks.length,
    logs: state.logs.length
  };
}

export function getStoreSnapshot() {
  const state = getState();
  return {
    machines: state.machines.map(cloneMachine),
    manuals: state.manuals.map(cloneManual),
    chunks: state.chunks.map(cloneChunk),
    logs: state.logs.map(cloneLog)
  };
}
