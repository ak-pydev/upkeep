import { created, badRequest, ok, methodNotAllowed } from "@/lib/upkeep/http";
import { createMachine, listMachines } from "@/lib/upkeep/store";
import type { MachineInput } from "@/lib/upkeep/types";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const query = url.searchParams.get("query") ?? undefined;
  const machines = listMachines({ query });

  return ok({
    machines,
    count: machines.length
  });
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as MachineInput | null;
  if (!body?.shopId || !body?.manufacturer || !body?.model) {
    return badRequest("shopId, manufacturer, and model are required.");
  }

  const machine = createMachine({
    shopId: body.shopId,
    manufacturer: body.manufacturer,
    model: body.model,
    nickname: body.nickname,
    serialNumber: body.serialNumber,
    status: body.status,
    tags: body.tags,
    notes: body.notes
  });

  return created({ machine });
}

export async function PUT() {
  return methodNotAllowed("PUT", ["GET", "POST"]);
}

export async function PATCH() {
  return methodNotAllowed("PATCH", ["GET", "POST"]);
}

