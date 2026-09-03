import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // PGlite is the local-dev database fallback; never bundle or ship it.
  serverExternalPackages: ["@electric-sql/pglite"],
  outputFileTracingExcludes: { "*": ["./node_modules/@electric-sql/pglite/**"] },
};

export default nextConfig;
