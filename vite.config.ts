import fs from "fs";
import path from "path";
import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, loadEnv } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import type { Plugin, UserConfig } from "vite";

// Emits maplibre-gl-worker.mjs and maplibre-gl-shared.mjs into the assets/
// directory so they can be found at runtime. The built maplibre chunk computes
// the worker URL as new URL("./maplibre-gl-worker.mjs", import.meta.url), which
// resolves relative to the chunk's own URL (/assets/maplibre-gl-HASH.js) →
// /assets/maplibre-gl-worker.mjs. The worker is a module worker, so the browser
// also fetches its import of ./maplibre-gl-shared.mjs from the same directory.
function maplibreWorkerPlugin(): Plugin {
  const distDir = path.resolve("node_modules/maplibre-gl/dist");
  return {
    name: "maplibre-worker",
    apply: "build",
    generateBundle() {
      for (const name of ["maplibre-gl-worker.mjs", "maplibre-gl-shared.mjs"]) {
        this.emitFile({
          type: "asset",
          fileName: `assets/${name}`,
          source: fs.readFileSync(path.join(distDir, name), "utf-8"),
        });
      }
    },
  };
}

// In dev, serves MapLibre's worker scripts as they are. Vite would otherwise
// add an import of its HMR client (for the worker's dynamic import()), and
// that client, running in a worker with no document, throws "document is
// not defined" whenever a CSS update arrives.
function maplibreDevWorkerPlugin(): Plugin {
  const distDir = path.resolve("node_modules/maplibre-gl/dist");
  const workerScript =
    /\/maplibre-gl\/dist\/(maplibre-gl-worker(?:-dev)?\.mjs)$/;
  return {
    name: "maplibre-dev-worker",
    apply: "serve",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const match = req.url?.split("?")[0].match(workerScript);
        if (!match) return next();
        res.setHeader("Content-Type", "text/javascript");
        res.end(fs.readFileSync(path.join(distDir, match[1]), "utf-8"));
      });
    },
  };
}

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
    plugins: [
      reactRouter(),
      tsconfigPaths(),
      tailwindcss(),
      maplibreWorkerPlugin(),
      maplibreDevWorkerPlugin(),
    ],
    optimizeDeps: { exclude: ["maplibre-gl"] },
    build: {
      commonjsOptions: {
        transformMixedEsModules: true,
      },
    },
  };
});
