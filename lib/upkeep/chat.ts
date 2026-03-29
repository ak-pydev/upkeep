import { generateClaudeAnswer } from "@/lib/integrations/claude";
import { createPartSuggestion, uniquePartLabels } from "@/lib/upkeep/parts";
import { pickSummarySnippet, rankChunks, rankLogs, rankMachines } from "@/lib/upkeep/search";
import type {
  ChatDraftLog,
  ChatRequestBody,
  ChatResult,
  RankedChunk,
  Manual,
  MaintenanceLog,
  Machine
} from "@/lib/upkeep/types";
import {
  listMachines,
  listManualChunks,
  listManuals,
  listLogs,
  findMachineById,
  findMachinesByQuery,
  findManualById
} from "@/lib/upkeep/store";

function buildPartLabels(chunks: RankedChunk[]) {
  const extracted: string[] = [];

  for (const entry of chunks) {
    const fromMeta = entry.chunk.partNumbers ?? [];
    extracted.push(...fromMeta);

    const match = /recommended parts?:\s*(.+?)(?:\.\s|$)/i.exec(entry.chunk.content);
    if (match?.[1]) {
      const labels = match[1]
        .split(/,| and /i)
        .map((part) => part.trim())
        .filter(Boolean);
      extracted.push(...labels);
    }
  }

  return uniquePartLabels(extracted);
}

function buildDemoAnswer(
  question: string,
  machine: Machine | null,
  manual: Manual | null,
  chunks: RankedChunk[],
  relatedLogs: MaintenanceLog[]
) {
  const lead = chunks[0];
  const mainSnippet = lead ? pickSummarySnippet(lead.chunk.content) : "";
  const sourceManual = manual?.title ?? lead?.manual.title ?? "the indexed manual";
  const problem = question.trim().replace(/\s+/g, " ");
  const lastLog = relatedLogs[0];

  const lines: string[] = [];
  lines.push(`Likely cause: ${mainSnippet || "the uploaded manual does not have enough indexed context for a grounded diagnosis."}`);
  lines.push(
    `What to do: inspect the machine, reseat the obvious connectors, and verify the alarm clears at low speed before returning it to production.`
  );

  if (chunks.length > 1) {
    lines.push(`Manual source: ${sourceManual} (${chunks.length} relevant chunk${chunks.length === 1 ? "" : "s"} found).`);
  } else if (manual) {
    lines.push(`Manual source: ${manual.title}.`);
  }

  if (lastLog) {
    lines.push(
      `Historical fix: a similar issue was logged on ${new Date(lastLog.createdAt).toLocaleDateString("en-US")} with resolution "${lastLog.resolution}".`
    );
  }

  lines.push(`Question interpreted: ${problem}.`);
  return lines.join("\n");
}

function buildClaudePrompt(
  question: string,
  machine: Machine | null,
  manual: Manual | null,
  chunks: RankedChunk[],
  logs: MaintenanceLog[]
) {
  const context = {
    machine,
    manual,
    chunks: chunks.map((entry) => ({
      manualTitle: entry.manual.title,
      pageNumber: entry.chunk.pageNumber,
      excerpt: entry.chunk.content,
      partNumbers: entry.chunk.partNumbers
    })),
    logs
  };

  return [
    "You are Upkeep, an industrial maintenance assistant.",
    "Give a grounded, concise answer using only the supplied context.",
    "Never invent facts that are not in the manual or logs.",
    "If the answer is uncertain, say what should be checked next instead of overclaiming.",
    "",
    `Question: ${question}`,
    `Context: ${JSON.stringify(context, null, 2)}`
  ].join("\n");
}

function deriveConfidence(chunks: RankedChunk[], machine: Machine | null) {
  const base = Math.min(0.95, 0.45 + chunks.length * 0.15);
  const adjusted = machine ? base : base - 0.08;
  return Math.max(0.1, Math.round(adjusted * 100) / 100);
}

function selectPrimaryManual(chunks: RankedChunk[]) {
  return chunks[0]?.manual ?? null;
}

export async function answerQuestion(body: ChatRequestBody): Promise<ChatResult> {
  const question = (body.question ?? "").trim();
  if (!question) {
    throw new Error("question is required");
  }

  const allMachines = listMachines();
  const machineById = body.machineId ? findMachineById(body.machineId) : null;
  const inferredMachines = body.machineId ? [] : findMachinesByQuery(question);
  const machine = machineById ?? inferredMachines[0] ?? (allMachines.length === 1 ? allMachines[0] : null);

  const manuals = listManuals({
    machineId: machine?.id,
    manualIds: body.manualIds
  });

  const manualChunks = listManualChunks({
    machineId: machine?.id,
    manualIds: body.manualIds
  });

  const rankedMachines = rankMachines(allMachines, question, 3);
  const rankedChunks = rankChunks(
    question,
    manualChunks
      .map((chunk) => ({
        chunk,
        manual: manuals.find((manual) => manual.id === chunk.manualId) ?? findManualById(chunk.manualId),
        score: 0
      }))
      .filter((entry): entry is RankedChunk => Boolean(entry.manual)),
    body.limit ?? 5
  );

  const relatedLogs = rankLogs(question, listLogs({ machineId: machine?.id }), body.limit ?? 5);
  const manual = selectPrimaryManual(rankedChunks) ?? manuals[0] ?? null;
  const partLabels = buildPartLabels(rankedChunks);

  const partSuggestions = uniquePartLabels(partLabels).map((label) =>
    createPartSuggestion(label, "Detected from the matched manual chunk and maintenance context.")
  );

  const modeRequested = process.env.UPKEEP_AI_MODE === "claude";
  const maybeClaude = modeRequested ? await generateClaudeAnswer({ system: "Use the supplied context.", user: buildClaudePrompt(question, machine, manual, rankedChunks, relatedLogs) }) : null;
  const answer = maybeClaude ?? buildDemoAnswer(question, machine, manual, rankedChunks, relatedLogs);

  const sources = rankedChunks.map((entry) => ({
    manualId: entry.manual.id,
    manualTitle: entry.manual.title,
    chunkId: entry.chunk.id,
    pageNumber: entry.chunk.pageNumber,
    excerpt: pickSummarySnippet(entry.chunk.content, 180),
    score: entry.score
  }));

  const logDraft: ChatDraftLog = {
    machineId: machine?.id ?? machineById?.id ?? rankedMachines[0]?.id ?? allMachines[0]?.id ?? "",
    issue: question,
    resolution: answer,
    partNumbers: partSuggestions.map((part) => part.label),
    sourceManualIds: rankedChunks.map((entry) => entry.manual.id)
  };

  return {
    machine,
    answer,
    confidence: deriveConfidence(rankedChunks, machine),
    sources,
    partSuggestions,
    relatedLogs,
    logDraft,
    modeUsed: maybeClaude ? "claude" : "demo"
  };
}
