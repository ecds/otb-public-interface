import { reactRouter } from "@react-router/dev/vite";
import { defineConfig, loadEnv } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";
import fs from "fs";
import path from "path";
import type { UserConfig } from "vite";

export default defineConfig(({ mode }): UserConfig => {
  const env = loadEnv(mode, process.cwd(), "");

  let httpsOptions = {};

  if (env.PROTOCOL === "https") {
    httpsOptions = {
      https: {
        key: fs.readFileSync(path.resolve(__dirname, ".cert/key.pem")),
        cert: fs.readFileSync(path.resolve(__dirname, ".cert/cert.pem")),
      },
      strictPort: true,
      hmr: {
        protocol: "wss",
      },
    };
  }

  return {
    server: {
      port: parseInt(env.PORT) ?? 3000,
      host: "lvh.me",
      allowedHosts: [".lvh.me", ".opentour.site", ".dev.opentour.site"],
      ...httpsOptions,
    },
    plugins: [reactRouter(), tsconfigPaths(), tailwindcss()],
  };
});
