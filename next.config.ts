import type { NextConfig } from "next";
import { REDIRECTS } from "./src/lib/content/redirect-map";

const nextConfig: NextConfig = {
  reactCompiler: true,
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
