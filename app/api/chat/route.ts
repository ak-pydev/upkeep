import { badRequest, notFound, ok, methodNotAllowed, readJson } from "@/lib/upkeep/http";
import { answerQuestion } from "@/lib/upkeep/chat";
import { findMachineById } from "@/lib/upkeep/store";
import { normalizeChatRequest } from "@/lib/upkeep/validation";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body = await readJson<unknown>(request);
  const parsed = normalizeChatRequest(body);
  if (!parsed.ok) {
    return badRequest(parsed.message);
  }

  try {
    if (
      parsed.value.machineId &&
      !(await findMachineById(parsed.value.machineId))
    ) {
      return notFound("Machine not found");
    }

    const result = await answerQuestion(parsed.value);
    return ok(result);
  } catch (error) {
    return badRequest(error instanceof Error ? error.message : "Failed to answer question.");
  }
}

export async function GET() {
  return methodNotAllowed("GET", ["POST"]);
}
