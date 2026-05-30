import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["src/**/*.{test,spec}.ts"],
    environment: "node",
    // Server-only modules under src/lib/booking/* may import "server-only".
    // We don't need to mock it for pure tests since pricing.ts / slots.ts
    // never reference DB / GCal / "server-only".
  },
  resolve: {
    alias: {
      "@": new URL("./src", import.meta.url).pathname,
      // The real "server-only" package throws on import (deliberate build-time
      // guard against shipping server modules to the client). vitest doesn't
      // know about that distinction, so we stub it out for tests.
      "server-only": new URL("./src/test/server-only-stub.ts", import.meta.url).pathname,
    },
  },
});
