import { created, badRequest, ok, methodNotAllowed } from "@/lib/upkeep/http";
import { createLog, listLogs } from "@/lib/upkeep/store";
import type { LogCreateInput } from "@/lib/upkeep/types";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const machineId = url.searchParams.get("machineId") ?? undefined;
  const query = url.searchParams.get("query") ?? undefined;

  const logs = query ? listLogs({ query }).filter((log) => !machineId || log.machineId === machineId) : listLogs({ machineId });

  return ok({
    logs,
    count: logs.length
  });
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as LogCreateInput | null;
  if (!body?.machineId || !body?.issue || !body?.resolution) {
    return badRequest("machineId, issue, and resolution are required.");
  }

  const log = createLog({
    machineId: body.machineId,
    issue: body.issue,
    resolution: body.resolution,
    partNumbers: body.partNumbers,
    sourceManualIds: body.sourceManualIds,
    createdBy: body.createdBy
  });

  return created({ log });
}

export async function PATCH() {
  return methodNotAllowed("PATCH", ["GET", "POST"]);
}

