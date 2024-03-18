// @ts-nocheck
import { createRequestHandler } from "@remix-run/architect";
import * as build from "@remix-run/dev/server-build";
import { installGlobals } from "@remix-run/node";
import sourceMapSupport from "source-map-support";

sourceMapSupport.install();
installGlobals();

export const handler = createRequestHandler({
  build,
  mode: build.mode,
  getLoadContext: (req, res) => {
    let tenant = undefined;
    const parts = req.headers.host.split(".");
    if (parts.length >= 3) {
      tenant = parts[0] !== "otb" ? parts[0] : undefined;
    }
    const request = {
      protocol: "http",
      host: "lvh.me:3000",
      headers: req.headers.host,
      req,
    };
    return { tenant, res, request, req };
  },
});
