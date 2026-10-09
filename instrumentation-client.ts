// First-party, cookieless analytics: see lib/track.ts and /privacy.
import { startTracking } from "@/lib/track";

try {
  startTracking();
} catch {}
