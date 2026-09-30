import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    environment: "happy-dom",
    globals: true,
    setupFiles: ["./app/test/setup.ts"],
    include: ["app/**/*.test.{ts,tsx}"],
    coverage: {
      provider: "v8",
      include: [
        "app/utils/cookies.ts",
        "app/hooks/usePreferences.ts",
        "app/components/mobile/ConsentSheet.tsx",
        "app/components/mobile/MapNudge.tsx",
        "app/components/shared/Embed.tsx",
      ],
    },
  },
});
