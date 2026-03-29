import { badRequest, ok, methodNotAllowed } from "@/lib/upkeep/http";
import { answerQuestion } from "@/lib/upkeep/chat";
import type { ChatRequestBody } from "@/lib/upkeep/types";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as ChatRequestBody | null;
  if (!body?.question?.trim()) {
    return badRequest("question is required.");
  }

  try {
    const result = await answerQuestion(body);
    return ok(result);
  } catch (error) {
    return badRequest(error instanceof Error ? error.message : "Failed to answer question.");
  }
}

export async function GET() {
  return methodNotAllowed("GET", ["POST"]);
}
