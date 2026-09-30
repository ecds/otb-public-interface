import { createContext } from "react-router";

// server.js runs as a plain Node process outside the Vite/Rollup bundle that
// produces build/server/index.js, so it can't import this module the same
// way the app code does. In production its own import of this file and the
// copy inlined into the server bundle are two separate module instances, so
// createContext() would otherwise hand out two different RouterContext
// objects. Caching on globalThis guarantees both sides resolve to the same
// instance no matter which one initializes it first.
const registry = (globalThis.__otbLoadContextRegistry ??= new Map());

function sharedContext(key) {
  if (!registry.has(key)) registry.set(key, createContext());
  return registry.get(key);
}

/** @type {import("react-router").RouterContext<string | undefined>} */
export const tenantContext = sharedContext("tenant");

/** @type {import("react-router").RouterContext<import("./types").TContextRequest>} */
export const requestContext = sharedContext("request");
