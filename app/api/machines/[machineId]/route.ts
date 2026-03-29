import { badRequest, methodNotAllowed, notFound, ok, readJson } from "@/lib/upkeep/http";
import { findMachineById, listLogs, listManuals, updateMachine } from "@/lib/upkeep/store";
import { normalizeMachinePatch } from "@/lib/upkeep/validation";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  context: { params: Promise<{ machineId: string }> }
) {
  const { machineId } = await context.params;
  const machine = await findMachineById(machineId);

  if (!machine) {
    return notFound("Machine not found");
  }

  const manuals = await listManuals({ machineId });
  const allLogs = await listLogs({ machineId });
  const logs = allLogs.slice(0, 10);

  return ok({
    machine,
    manuals,
    logs,
    manualCount: manuals.length,
    logCount: allLogs.length
  });
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ machineId: string }> }
) {
  const { machineId } = await context.params;
  const body = await readJson<unknown>(request);
  const parsed = normalizeMachinePatch(body);
  if (!parsed.ok) {
    return badRequest(parsed.message);
  }

  const machine = await updateMachine(machineId, parsed.value);
  if (!machine) {
    return notFound("Machine not found");
  }

  return ok({ machine });
}

export async function DELETE() {
  return methodNotAllowed("DELETE", ["GET", "PATCH"]);
}
