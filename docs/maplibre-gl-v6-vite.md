# maplibre-gl v6 + Vite + React Router

## The problem

maplibre-gl v6 ships as ES modules only (`.mjs`). Its main chunk uses `import.meta.url` to compute the worker URL at runtime:

```js
new URL("./maplibre-gl-worker.mjs", import.meta.url)
```

When Vite bundles maplibre into a chunk (e.g. `/assets/maplibre-gl-HASH.js`), `import.meta.url` resolves to that chunk's URL. So the worker is expected at `/assets/maplibre-gl-worker.mjs`. The worker is a module that imports `./maplibre-gl-shared.mjs`, so that file must be in the same directory too. Neither file is emitted by Vite by default — requests 302 to the SSR handler → `text/html` MIME type → worker load failure.

`setWorkerUrl()` doesn't help because Vite's chunking can produce separate module instances where the internal config object isn't shared.

## The fix: a Vite plugin

Add this to `vite.config.ts`. It emits both files into `assets/` during the build:

```ts
import fs from "fs";
import path from "path";
import type { Plugin } from "vite";

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
```

Then add it to `plugins` and exclude maplibre from dep pre-bundling:

```ts
plugins: [..., maplibreWorkerPlugin()],
optimizeDeps: { exclude: ["maplibre-gl"] },
```

## Why `optimizeDeps: { exclude }`?

Without it, Vite's esbuild pre-bundler tries to bundle maplibre at dev-server startup and chokes on its internal worker references. Excluding it lets Rollup handle it during build as native ESM.

## Server-side consideration (React Router / Remix)

React Router's SSR handler catches `app.all("*", ...)` — any path that doesn't match a static file returns a 302 redirect (not 404). This means missing worker files silently fail with `text/html` instead of a 404, making the error harder to diagnose. The fix above prevents the files from ever being missing.

The static middleware ordering matters:

```js
app.use("/assets", express.static("build/client/assets", { immutable: true, maxAge: "1y" }));
app.use(express.static("build/client", { maxAge: "1h" }));
app.all("*", handler); // SSR — catches everything else
```

## Checklist for a new project

- [ ] `npm install maplibre-gl@^6`
- [ ] Remove any `import workerUrl from "maplibre-gl/dist/maplibre-gl-csp-worker?worker"` or `setWorkerUrl` calls (the CSP worker variant no longer exists in v6)
- [ ] Add the plugin above to `vite.config.ts`
- [ ] Add `optimizeDeps: { exclude: ["maplibre-gl"] }`
- [ ] Confirm `build/client/assets/maplibre-gl-worker.mjs` and `maplibre-gl-shared.mjs` exist after build
