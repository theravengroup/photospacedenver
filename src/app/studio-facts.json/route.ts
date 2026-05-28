import { buildStudioFacts } from "@/lib/content/studio-facts";

export const dynamic = "force-static";

/** Machine-readable fact sheet for AI/search/retrieval tools. */
export function GET() {
  return Response.json(buildStudioFacts());
}
