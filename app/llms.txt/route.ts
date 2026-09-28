import { llmsTxt } from "@/lib/seo";

// Built once from the content data (lib/seo.ts); no request data involved.
export const dynamic = "force-static";

/** /llms.txt: a map of the site for AI assistants (llmstxt.org). */
export function GET() {
  return new Response(llmsTxt(), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
