import { methodNotAllowed, notFound, ok } from "@/lib/upkeep/http";
import { findMachineById, findManualById, listManualChunks } from "@/lib/upkeep/store";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  context: { params: Promise<{ manualId: string }> }
) {
  const { manualId } = await context.params;
  const manual = await findManualById(manualId);

  if (!manual) {
    return notFound("Manual not found");
  }

  const chunks = await listManualChunks({ manualIds: [manualId] });
  const machine = await findMachineById(manual.machineId);

  return ok({
    manual,
    machine,
    chunks,
    chunkCount: chunks.length
  });
}

export async function PATCH() {
  return methodNotAllowed("PATCH", ["GET"]);
}
