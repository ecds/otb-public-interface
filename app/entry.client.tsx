/**
 * By default, Remix will handle hydrating your app on the client for you.
 * You are free to delete this file if you'd like to, but if you ever want it revealed again, you can run `npx remix reveal` ✨
 * For more information, see https://remix.run/file-conventions/entry.client
 */

import { startTransition, StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import { HydratedRouter } from "react-router/dom";
import * as maplibregl from "maplibre-gl";
import MaplibreWorker from "maplibre-gl/dist/maplibre-gl-csp-worker?worker";

// maplibre-gl v6 requires explicit worker registration when bundled with Vite
(maplibregl as unknown as { workerClass: unknown }).workerClass = MaplibreWorker;

startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <HydratedRouter />
    </StrictMode>
  );
});
