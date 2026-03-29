import { created, badRequest, ok, methodNotAllowed, notFound, readJson } from "@/lib/upkeep/http";
import { createLog, listLogs } from "@/lib/upkeep/store";
import { normalizeLogCreateInput, parseLimit } from "@/lib/upkeep/validation";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const machineId = url.searchParams.get("machineId")?.trim() || undefined;
  const query = url.searchParams.get("query")?.trim() || undefined;
  const sourceManualId = url.searchParams.get("sourceManualId")?.trim() || undefined;
  const limit = parseLimit(url.searchParams.get("limit"), 25, 100);

  const logs = listLogs({
    query,
    machineId,
    sourceManualId,
    limit
  });

  return ok({
    logs,
    count: logs.length,
    filters: {
      machineId,
      query,
      sourceManualId,
      limit
    }
  });
}

export async function POST(request: Request) {
  const body = await readJson<unknown>(request);
  const parsed = normalizeLogCreateInput(body);
  if (!parsed.ok) {
    return badRequest(parsed.message);
  }

  try {
    const log = createLog(parsed.value);

    return created({ log });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to save log.";
    return message === "Machine not found" ? notFound(message) : badRequest(message);
  }
}

export async function PATCH() {
  return methodNotAllowed("PATCH", ["GET", "POST"]);
}
