import { created, badRequest, ok, methodNotAllowed } from "@/lib/upkeep/http";
import { createManual, listManuals } from "@/lib/upkeep/store";
import type { ManualCreateInput } from "@/lib/upkeep/types";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const machineId = url.searchParams.get("machineId") ?? undefined;
  const manuals = listManuals({ machineId });

  return ok({
    manuals,
    count: manuals.length
  });
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as ManualCreateInput | null;
  if (!body?.machineId || !body?.title || !body?.filename) {
    return badRequest("machineId, title, and filename are required.");
  }

  const result = createManual({
    machineId: body.machineId,
    title: body.title,
    filename: body.filename,
    sourceUrl: body.sourceUrl,
    pages: body.pages,
    notes: body.notes,
    sourceText: body.sourceText,
    chunks: body.chunks
  });

  return created({
    manual: result.manual,
    chunks: result.chunks,
    indexStatus: result.chunks.length > 0 ? "indexed" : "pending"
  });
}

export async function PUT() {
  return methodNotAllowed("PUT", ["GET", "POST"]);
}

