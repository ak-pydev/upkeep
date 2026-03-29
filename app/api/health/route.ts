import { getSupabaseBoundarySummary } from "@/lib/integrations/supabase";
import { getSeedCounts } from "@/lib/upkeep/store";
import { ok } from "@/lib/upkeep/http";

export const dynamic = "force-dynamic";

export async function GET() {
  return ok({
    ok: true,
    service: "upkeep-api",
    mode: "demo-first",
    timestamp: new Date().toISOString(),
    counts: getSeedCounts(),
    boundaries: {
      supabase: getSupabaseBoundarySummary(),
      claude: {
        configured: Boolean(process.env.ANTHROPIC_API_KEY),
        mode: process.env.UPKEEP_AI_MODE ?? "demo"
      }
    }
  });
}

