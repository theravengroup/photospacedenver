import type { NextConfig } from "next";
import { REDIRECTS } from "./src/lib/content/redirect-map";

const nextConfig: NextConfig = {
  reactCompiler: true,
  /**
   * Tree-shake heavy icon / animation / Radix packages so each route only
   * ships the named exports it actually imports. lucide-react alone is 39 MB
   * on disk with 14+ named imports across the booking flow and mega menu —
   * without this, Next bundles the full module map for every route. Dan-
   * asked perf sweep 2026-05-30.
   */
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "motion",
      "@radix-ui/react-navigation-menu",
      "@radix-ui/react-dialog",
    ],
  },
  async redirects() {
    // Next normalizes trailing slashes first (e.g. /gear/ → /gear), so we only
    // need bare-path sources here. Skip from===to (those are real routes Next
    // serves directly; a self-redirect would loop).
    return REDIRECTS.filter((r) => r.from !== r.to).map(({ from, to }) => ({
      source: from,
      destination: to,
      statusCode: 301,
    }));
  },
};

export default nextConfig;
