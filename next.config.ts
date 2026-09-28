import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // PGlite is the local-dev database fallback; never bundle or ship it.
  serverExternalPackages: ["@electric-sql/pglite"],
  outputFileTracingExcludes: { "*": ["./node_modules/@electric-sql/pglite/**"] },
  // The agents pages moved under /product (docs/archive/agents-framing.md). Keep old links working.
  async redirects() {
    const moved: [string, string][] = [
      ["/agents", "/product"],
      ["/agents/meeting", "/product/meetings"],
      ["/agents/research", "/product/research"],
      ["/agents/analyst", "/product/analytics"],
      ["/agents/product", "/product/priorities"],
      ["/agents/roadmap", "/product/roadmap"],
      ["/agents/execution", "/product/tasks"],
    ];
    return moved.map(([source, destination]) => ({ source, destination, permanent: true }));
  },
};

export default nextConfig;
