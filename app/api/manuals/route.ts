import { created, badRequest, ok, methodNotAllowed, notFound, readJson } from "@/lib/upkeep/http";
import { createManual, findMachineById, listManuals } from "@/lib/upkeep/store";
import { normalizeManualCreateInput, parseLimit, parseManualStatus } from "@/lib/upkeep/validation";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const machineId = url.searchParams.get("machineId")?.trim() || undefined;
  const query = url.searchParams.get("query")?.trim() || undefined;
  const status = parseManualStatus(url.searchParams.get("status"));
  if (status === null) {
    return badRequest("status must be one of pending, indexed, or failed.");
  }
  const limit = parseLimit(url.searchParams.get("limit"), 25, 100);
  const manuals = await listManuals({ machineId, query, status, limit });

  return ok({
    manuals,
    count: manuals.length,
    filters: {
      machineId,
      query,
      status,
      limit
    }
  });
}

export async function POST(request: Request) {
  const body = await readJson<unknown>(request);
  const parsed = normalizeManualCreateInput(body);
  if (!parsed.ok) {
    return badRequest(parsed.message);
  }

  const machine = await findMachineById(parsed.value.machineId);
  if (!machine) {
    return notFound("Machine not found");
  }

  try {
    const result = await createManual(parsed.value);

    return created({
      manual: result.manual,
      chunks: result.chunks,
      indexStatus: result.chunks.length > 0 ? "indexed" : "pending"
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to create manual.";
    return message === "Machine not found" ? notFound(message) : badRequest(message);
  }
}

export async function PUT() {
  return methodNotAllowed("PUT", ["GET", "POST"]);
}
