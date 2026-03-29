import { methodNotAllowed, notFound, ok } from "@/lib/upkeep/http";
import { findManualById, listManualChunks } from "@/lib/upkeep/store";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  context: { params: { manualId: string } }
) {
  const { manualId } = context.params;
  const manual = findManualById(manualId);

  if (!manual) {
    return notFound("Manual not found");
  }

  const chunks = listManualChunks({ manualIds: [manualId] });

  return ok({
    manual,
    chunks,
    chunkCount: chunks.length
  });
}

export async function PATCH() {
  return methodNotAllowed("PATCH", ["GET"]);
}
