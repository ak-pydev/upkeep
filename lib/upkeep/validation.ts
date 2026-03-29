import { uniquePartLabels } from "./parts";
import type {
  ChatRequestBody,
  LogCreateInput,
  MachineInput,
  MachinePatch,
  MachineStatus,
  ManualCreateInput,
  ManualStatus
} from "./types";

type ParseResult<T> = { ok: true; value: T } | { ok: false; message: string };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function trimString(value: unknown): string | null {
  return typeof value === "string" ? value.trim() : null;
}

function optionalString(value: unknown): string | undefined {
  const trimmed = trimString(value);
  return trimmed ? trimmed : undefined;
}

function parseNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  if (typeof value !== "string") {
    return null;
  }
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function parseBoundedInteger(value: unknown, minimum: number, maximum: number): number | null {
  const parsed = parseNumber(value);
  if (parsed === null) {
    return null;
  }
  const rounded = Math.trunc(parsed);
  if (rounded < minimum || rounded > maximum) {
    return null;
  }
  return rounded;
}

function parseStringArray(value: unknown): string[] | null {
  if (value === undefined || value === null) {
    return [];
  }

  const raw = Array.isArray(value)
    ? value
    : typeof value === "string"
      ? value.split(",")
      : null;

  if (!raw) {
    return null;
  }

  const output: string[] = [];
  for (const entry of raw) {
    const normalized = trimString(entry);
    if (normalized === null) {
      return null;
    }
    if (normalized) {
      output.push(normalized);
    }
  }

  return uniquePartLabels(output);
}

function parseStatus<T extends string>(value: unknown, allowed: readonly T[]): T | undefined | null {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }

  const normalized = trimString(value);
  if (!normalized) {
    return undefined;
  }

  return allowed.includes(normalized as T) ? (normalized as T) : null;
}

export function parseLimit(value: unknown, defaultValue = 5, maximum = 50) {
  const parsed = parseBoundedInteger(value, 1, maximum);
  return parsed ?? defaultValue;
}

export function normalizeMachineInput(body: unknown): ParseResult<MachineInput> {
  if (!isRecord(body)) {
    return { ok: false, message: "A JSON object is required." };
  }

  const shopId = trimString(body.shopId);
  const manufacturer = trimString(body.manufacturer);
  const model = trimString(body.model);

  if (!shopId || !manufacturer || !model) {
    return {
      ok: false,
      message: "shopId, manufacturer, and model are required."
    };
  }

  const status = parseStatus(body.status, ["active", "idle", "maintenance", "down"] as const);
  if (status === null) {
    return { ok: false, message: "status must be one of active, idle, maintenance, or down." };
  }

  const tags = parseStringArray(body.tags);
  if (tags === null) {
    return { ok: false, message: "tags must be an array or comma-separated string of labels." };
  }

  return {
    ok: true,
    value: {
      shopId,
      manufacturer,
      model,
      nickname: optionalString(body.nickname),
      serialNumber: optionalString(body.serialNumber),
      status,
      tags,
      notes: optionalString(body.notes)
    }
  };
}

export function normalizeMachinePatch(body: unknown): ParseResult<MachinePatch> {
  if (!isRecord(body)) {
    return { ok: false, message: "A JSON object is required." };
  }

  const patch: MachinePatch = {};
  let hasValue = false;

  const shopId = optionalString(body.shopId);
  if (shopId !== undefined) {
    patch.shopId = shopId;
    hasValue = true;
  }

  const manufacturer = optionalString(body.manufacturer);
  if (manufacturer !== undefined) {
    patch.manufacturer = manufacturer;
    hasValue = true;
  }

  const model = optionalString(body.model);
  if (model !== undefined) {
    patch.model = model;
    hasValue = true;
  }

  const nickname = optionalString(body.nickname);
  if (nickname !== undefined) {
    patch.nickname = nickname;
    hasValue = true;
  }

  const serialNumber = optionalString(body.serialNumber);
  if (serialNumber !== undefined) {
    patch.serialNumber = serialNumber;
    hasValue = true;
  }

  const status = parseStatus(body.status, ["active", "idle", "maintenance", "down"] as const);
  if (status === null) {
    return { ok: false, message: "status must be one of active, idle, maintenance, or down." };
  }
  if (status !== undefined) {
    patch.status = status;
    hasValue = true;
  }

  const tags = parseStringArray(body.tags);
  if (tags === null) {
    return { ok: false, message: "tags must be an array or comma-separated string of labels." };
  }
  if (tags.length > 0 || Array.isArray(body.tags) || typeof body.tags === "string") {
    patch.tags = tags;
    hasValue = true;
  }

  const notes = optionalString(body.notes);
  if (notes !== undefined) {
    patch.notes = notes;
    hasValue = true;
  }

  if (!hasValue) {
    return { ok: false, message: "At least one field is required to update a machine." };
  }

  return { ok: true, value: patch };
}

export function normalizeManualCreateInput(body: unknown): ParseResult<ManualCreateInput> {
  if (!isRecord(body)) {
    return { ok: false, message: "A JSON object is required." };
  }

  const machineId = trimString(body.machineId);
  const title = trimString(body.title);
  const filename = trimString(body.filename);
  const sourceUrl = optionalString(body.sourceUrl);
  const notes = optionalString(body.notes);
  const sourceText = optionalString(body.sourceText);
  const pages = parseBoundedInteger(body.pages, 1, 100000);
  if (body.chunks !== undefined && !Array.isArray(body.chunks)) {
    return { ok: false, message: "chunks must be an array of objects with content." };
  }
  const chunks = Array.isArray(body.chunks) ? body.chunks : undefined;

  if (!machineId || !title || !filename) {
    return {
      ok: false,
      message: "machineId, title, and filename are required."
    };
  }

  if (body.pages !== undefined && pages === null) {
    return { ok: false, message: "pages must be a positive integer when provided." };
  }

  let parsedChunks: ManualCreateInput["chunks"];
  if (chunks !== undefined) {
    parsedChunks = [];
    for (const chunk of chunks) {
      if (!isRecord(chunk)) {
        return { ok: false, message: "chunks must contain objects with content." };
      }
      const content = trimString(chunk.content);
      if (!content) {
        return { ok: false, message: "Each chunk must include non-empty content." };
      }
      const partNumbers = parseStringArray(chunk.partNumbers);
      if (partNumbers === null) {
        return { ok: false, message: "chunk partNumbers must be strings." };
      }

      parsedChunks.push({
        content,
        pageNumber: parseBoundedInteger(chunk.pageNumber, 1, 100000) ?? undefined,
        partNumbers
      });
    }
  }

  if (!sourceText && (!parsedChunks || parsedChunks.length === 0) && !sourceUrl) {
    return {
      ok: false,
      message: "Provide sourceText, chunks, or sourceUrl so the manual can be ingested."
    };
  }

  return {
    ok: true,
    value: {
      machineId,
      title,
      filename,
      sourceUrl,
      pages: pages ?? undefined,
      notes,
      sourceText,
      chunks: parsedChunks
    }
  };
}

export function normalizeLogCreateInput(body: unknown): ParseResult<LogCreateInput> {
  if (!isRecord(body)) {
    return { ok: false, message: "A JSON object is required." };
  }

  const machineId = trimString(body.machineId);
  const issue = trimString(body.issue);
  const resolution = trimString(body.resolution);

  if (!machineId || !issue || !resolution) {
    return {
      ok: false,
      message: "machineId, issue, and resolution are required."
    };
  }

  const partNumbers = parseStringArray(body.partNumbers);
  if (partNumbers === null) {
    return { ok: false, message: "partNumbers must be an array or comma-separated string." };
  }

  const sourceManualIds = parseStringArray(body.sourceManualIds);
  if (sourceManualIds === null) {
    return { ok: false, message: "sourceManualIds must be an array or comma-separated string." };
  }

  return {
    ok: true,
    value: {
      machineId,
      issue,
      resolution,
      partNumbers,
      sourceManualIds,
      createdBy: optionalString(body.createdBy)
    }
  };
}

export function normalizeChatRequest(body: unknown): ParseResult<ChatRequestBody> {
  if (!isRecord(body)) {
    return { ok: false, message: "A JSON object is required." };
  }

  const question = optionalString(body.question);
  if (!question) {
    return { ok: false, message: "question is required." };
  }

  const machineId = optionalString(body.machineId);
  const manualIds = parseStringArray(body.manualIds);
  if (manualIds === null) {
    return { ok: false, message: "manualIds must be an array or comma-separated string." };
  }

  const parsedLimit = body.limit === undefined ? undefined : parseBoundedInteger(body.limit, 1, 10);
  if (body.limit !== undefined && parsedLimit === null) {
    return { ok: false, message: "limit must be an integer between 1 and 10." };
  }
  const limit = parsedLimit === null ? undefined : parsedLimit;

  return {
    ok: true,
    value: {
      question,
      machineId,
      manualIds,
      limit
    }
  };
}

export function parseMachineStatus(value: unknown): MachineStatus | undefined | null {
  return parseStatus(value, ["active", "idle", "maintenance", "down"] as const);
}

export function parseManualStatus(value: unknown): ManualStatus | undefined | null {
  return parseStatus(value, ["pending", "indexed", "failed"] as const);
}

export function parseStringArrayValue(value: string | null): string[] | undefined {
  if (value === null) {
    return undefined;
  }

  const parsed = parseStringArray(value);
  return parsed ?? undefined;
}
