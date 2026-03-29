import { created, badRequest, ok, methodNotAllowed, readJson } from "@/lib/upkeep/http";
import { createMachine, listMachines } from "@/lib/upkeep/store";
import { normalizeMachineInput, parseLimit, parseMachineStatus, parseStringArrayValue } from "@/lib/upkeep/validation";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const query = url.searchParams.get("query")?.trim() || undefined;
  const shopId = url.searchParams.get("shopId")?.trim() || undefined;
  const status = parseMachineStatus(url.searchParams.get("status"));
  if (status === null) {
    return badRequest("status must be one of active, idle, maintenance, or down.");
  }
  const manualId = url.searchParams.get("manualId")?.trim() || undefined;
  const tags = parseStringArrayValue(url.searchParams.get("tags") ?? url.searchParams.get("tag"));
  const limit = parseLimit(url.searchParams.get("limit"), 25, 100);
  const machines = listMachines({ query, shopId, status, manualId, tags, limit });

  return ok({
    machines,
    count: machines.length,
    filters: {
      query,
      shopId,
      status,
      manualId,
      tags,
      limit
    }
  });
}

export async function POST(request: Request) {
  const body = await readJson<unknown>(request);
  const parsed = normalizeMachineInput(body);
  if (!parsed.ok) {
    return badRequest(parsed.message);
  }

  const machine = createMachine(parsed.value);

  return created({ machine });
}

export async function PUT() {
  return methodNotAllowed("PUT", ["GET", "POST"]);
}

export async function PATCH() {
  return methodNotAllowed("PATCH", ["GET", "POST"]);
}
