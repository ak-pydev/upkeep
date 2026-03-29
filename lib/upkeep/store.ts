import { chunkText } from "@/lib/upkeep/chunker";
import { createSeedSnapshot } from "@/lib/upkeep/seed";
import type {
  LogCreateInput,
  LogListOptions,
  Machine,
  MachineInput,
  MachinePatch,
  MachineListOptions,
  Manual,
  ManualChunk,
  ManualChunkInput,
  ManualCreateInput,
  MaintenanceLog,
  ManualListOptions,
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

function cleanString(value?: string) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

function requireMachine(state: StoreState, machineId: string) {
  return state.machines.find((entry) => entry.id === machineId) ?? null;
}

function normalizeChunkPartNumbers(partNumbers?: string[]) {
  return uniquePartLabels(partNumbers ?? []);
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

type ManualChunkDraft = {
  manualId: string;
  chunkIndex: number;
  pageNumber: number | undefined;
  content: string;
  partNumbers: string[];
  createdAt: string;
};

function normalizeInputChunks(manualId: string, chunks: ManualChunkInput[]): ManualChunk[] {
  const normalized: ManualChunkDraft[] = chunks.flatMap((chunk, index) => {
    const content = cleanString(chunk.content);
    if (!content) {
      return [];
    }

    return [
      {
        manualId,
        chunkIndex: index,
        pageNumber: chunk.pageNumber,
        content,
        partNumbers: normalizeChunkPartNumbers(chunk.partNumbers),
        createdAt: nowIso()
      }
    ];
  });

  return normalized.map((chunk, index) => ({
    ...chunk,
    id: createId("chunk", nextCounterKey("chunk")),
    chunkIndex: index
  }));
}

function createChunksFromText(manualId: string, text?: string): ManualChunk[] {
  const cleanedText = cleanString(text);
  if (!cleanedText) {
    return [];
  }

  return chunkText(cleanedText).map((content, index): ManualChunk => ({
    id: createId("chunk", nextCounterKey("chunk")),
    manualId,
    chunkIndex: index,
    content,
    partNumbers: [],
    createdAt: nowIso()
  }));
}

export function listMachines(options?: MachineListOptions) {
  const state = getState();
  const filtered = state.machines.filter((machine) => {
    if (options?.shopId && machine.shopId !== options.shopId) {
      return false;
    }
    if (options?.status && machine.status !== options.status) {
      return false;
    }
    if (options?.manualId && !machine.manualIds.includes(options.manualId)) {
      return false;
    }
    if (options?.tags?.length && !options.tags.every((tag) => machine.tags.some((machineTag) => machineTag.toLowerCase() === tag.toLowerCase()))) {
      return false;
    }
    return true;
  });

  const machines = options?.query
    ? rankMachines(filtered, options.query, options.limit ?? filtered.length)
    : filtered.slice(0, options?.limit ?? filtered.length);

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
    shopId: input.shopId.trim(),
    manufacturer: input.manufacturer.trim(),
    model: input.model.trim(),
    nickname: cleanString(input.nickname),
    serialNumber: cleanString(input.serialNumber),
    status: input.status ?? "active",
    tags: uniquePartLabels(input.tags ?? []),
    notes: cleanString(input.notes),
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

  if (patch.shopId !== undefined) machine.shopId = patch.shopId.trim();
  if (patch.manufacturer !== undefined) machine.manufacturer = patch.manufacturer.trim();
  if (patch.model !== undefined) machine.model = patch.model.trim();
  if (patch.nickname !== undefined) machine.nickname = cleanString(patch.nickname);
  if (patch.serialNumber !== undefined) machine.serialNumber = cleanString(patch.serialNumber);
  if (patch.status !== undefined) machine.status = patch.status;
  if (patch.tags !== undefined) machine.tags = uniquePartLabels(patch.tags);
  if (patch.notes !== undefined) machine.notes = cleanString(patch.notes);
  machine.updatedAt = nowIso();

  persistState(state);
  return cloneMachine(machine);
}

export function listManuals(options?: ManualListOptions) {
  const state = getState();
  const manualIds = options?.manualIds?.length ? new Set(options.manualIds) : null;
  const manuals = state.manuals.filter((manual) => {
    if (options?.machineId && manual.machineId !== options.machineId) {
      return false;
    }
    if (options?.status && manual.status !== options.status) {
      return false;
    }
    if (manualIds && !manualIds.has(manual.id)) {
      return false;
    }
    if (options?.query) {
      const haystack = [manual.title, manual.filename, manual.notes ?? ""].join(" ").toLowerCase();
      const tokens = options.query.toLowerCase().split(/\s+/).filter(Boolean);
      if (!tokens.every((token) => haystack.includes(token))) {
        return false;
      }
    }
    return true;
  });

  return manuals.slice(0, options?.limit ?? manuals.length).map(cloneManual);
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
  const machine = requireMachine(state, input.machineId);
  if (!machine) {
    throw new Error("Machine not found");
  }

  const manualId = createId("manual", nextCounterKey("manual"));
  const manualChunks = input.chunks?.length
    ? normalizeInputChunks(manualId, input.chunks)
    : createChunksFromText(manualId, input.sourceText);
  const manual: Manual = {
    id: manualId,
    machineId: input.machineId,
    title: input.title.trim(),
    filename: input.filename.trim(),
    sourceUrl: cleanString(input.sourceUrl),
    pages: input.pages,
    status: manualChunks.length > 0 ? "indexed" : "pending",
    chunkCount: manualChunks.length,
    createdAt: nowIso(),
    indexedAt: manualChunks.length > 0 ? nowIso() : undefined,
    notes: cleanString(input.notes)
  };

  state.manuals.unshift(manual);
  state.chunks.unshift(...manualChunks);

  if (!machine.manualIds.includes(manual.id)) {
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
  const machine = requireMachine(state, input.machineId);
  if (!machine) {
    throw new Error("Machine not found");
  }

  const sourceManualIds = uniquePartLabels(input.sourceManualIds ?? []);
  if (sourceManualIds.length > 0) {
    const allowedManualIds = new Set(machine.manualIds);
    const invalidManualIds = sourceManualIds.filter((manualId) => !allowedManualIds.has(manualId));
    if (invalidManualIds.length > 0) {
      throw new Error("sourceManualIds must belong to the selected machine");
    }
  }

  const log: MaintenanceLog = {
    id: createId("log", nextCounterKey("log")),
    machineId: input.machineId,
    issue: input.issue.trim(),
    resolution: input.resolution.trim(),
    partNumbers: uniquePartLabels(input.partNumbers ?? []),
    sourceManualIds,
    createdBy: cleanString(input.createdBy),
    createdAt: nowIso()
  };

  state.logs.unshift(log);
  persistState(state);

  if (isSupabaseConfigured()) {
    // Demo-first default. Wire the Supabase write path here when the service is enabled.
  }

  return cloneLog(log);
}

export function listLogs(options?: LogListOptions) {
  const state = getState();
  const filtered = state.logs.filter((log) => {
    if (options?.machineId && log.machineId !== options.machineId) {
      return false;
    }
    if (options?.sourceManualId && !log.sourceManualIds.includes(options.sourceManualId)) {
      return false;
    }
    if (options?.query) {
      const score = rankLogs(options.query, [log], 1);
      return score.length > 0;
    }
    return true;
  });

  const logs = options?.query ? rankLogs(options.query, filtered, options.limit ?? filtered.length) : filtered.slice(0, options?.limit ?? filtered.length);

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
