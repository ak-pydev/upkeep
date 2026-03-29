import type { RankedChunk, MaintenanceLog, Machine } from "./types";

function normalize(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9\s-]/g, " ");
}

function tokenize(text: string): string[] {
  return normalize(text)
    .split(/\s+/)
    .map((token) => token.trim())
    .filter((token) => token.length > 1);
}

function scoreAgainst(queryTokens: string[], text: string) {
  if (queryTokens.length === 0) {
    return 0;
  }

  const normalizedText = normalize(text);
  let score = 0;

  for (const token of queryTokens) {
    if (normalizedText.includes(token)) {
      score += token.length > 4 ? 3 : 1;
    }
  }

  const errorMatch = /(?:alarm|error code|code)\s*([a-z0-9-]+)/i.exec(text);
  if (errorMatch) {
    const code = errorMatch[1].toLowerCase();
    if (queryTokens.some((token) => token === code || normalizedText.includes(code))) {
      score += 6;
    }
  }

  return score;
}

export function rankMachines(machines: Machine[], query: string, limit = 5): Machine[] {
  const tokens = tokenize(query);
  return machines
    .map((machine) => {
      const haystack = [machine.manufacturer, machine.model, machine.nickname ?? "", machine.notes ?? "", machine.tags.join(" ")].join(" ");
      return {
        machine,
        score: scoreAgainst(tokens, haystack)
      };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ machine }) => machine);
}

export function rankChunks(
  query: string,
  chunks: RankedChunk[],
  limit = 5
): RankedChunk[] {
  const tokens = tokenize(query);

  return chunks
    .map((entry) => ({
      ...entry,
      score: scoreAgainst(tokens, `${entry.chunk.content} ${entry.chunk.partNumbers.join(" ")}`)
    }))
    .sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      return a.chunk.chunkIndex - b.chunk.chunkIndex;
    })
    .slice(0, limit);
}

export function rankLogs(query: string, logs: MaintenanceLog[], limit = 5) {
  const tokens = tokenize(query);
  return logs
    .map((log) => {
      const score = scoreAgainst(tokens, `${log.issue} ${log.resolution} ${log.partNumbers.join(" ")}`);
      return { log, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ log }) => log);
}

export function pickSummarySnippet(text: string, maxLength = 220) {
  const normalized = text.replace(/\s+/g, " ").trim();
  if (normalized.length <= maxLength) {
    return normalized;
  }
  return `${normalized.slice(0, maxLength - 1).trimEnd()}…`;
}

