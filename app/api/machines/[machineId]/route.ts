import { badRequest, methodNotAllowed, notFound, ok } from "@/lib/upkeep/http";
import { findMachineById, updateMachine } from "@/lib/upkeep/store";
import type { MachinePatch } from "@/lib/upkeep/types";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  context: { params: { machineId: string } }
) {
  const { machineId } = context.params;
  const machine = findMachineById(machineId);

  if (!machine) {
    return notFound("Machine not found");
  }

  return ok({ machine });
}

export async function PATCH(
  request: Request,
  context: { params: { machineId: string } }
) {
  const { machineId } = context.params;
  const patch = (await request.json().catch(() => null)) as MachinePatch | null;

  if (!patch) {
    return badRequest("A JSON body is required.");
  }

  const machine = updateMachine(machineId, patch);
  if (!machine) {
    return notFound("Machine not found");
  }

  return ok({ machine });
}

export async function DELETE() {
  return methodNotAllowed("DELETE", ["GET", "PATCH"]);
}
