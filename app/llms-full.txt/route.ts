import { llmsFullTxt } from "@/lib/seo";

// Built once from the content data (lib/seo.ts); no request data involved.
export const dynamic = "force-static";

/** /llms-full.txt: every product area, integration and use case in one file, for AI assistants. */
export function GET() {
  return new Response(llmsFullTxt(), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
