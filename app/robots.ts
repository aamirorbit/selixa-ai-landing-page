import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

/**
 * AI search and assistant crawlers, named so the intent is explicit: we want Selixa found and
 * cited in ChatGPT, Claude, Perplexity, Gemini and Copilot answers.
 */
const AI_CRAWLERS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-SearchBot",
  "Claude-User",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot-Extended",
  "Bingbot",
];

/** /robots.txt: everything public is crawlable, by search engines and AI crawlers alike; the inquiry admin is not. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: "/admin" },
      { userAgent: AI_CRAWLERS, allow: "/", disallow: "/admin" },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
