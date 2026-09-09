import fs from "node:fs";
import http from "node:http";
import https from "node:https";
import path from "node:path";
import { createRequestHandler } from "@react-router/express";
import compression from "compression";
import express from "express";
import morgan from "morgan";
import { RouterContextProvider } from "react-router";
import { requestContext, tenantContext } from "./app/context.js";

const viteDevServer =
  process.env.NODE_ENV === "production"
    ? undefined
    : await import("vite").then((vite) =>
        vite.createServer({
          server: { middlewareMode: true },
        }),
      );

const handler = createRequestHandler({
  build: viteDevServer
    ? () => viteDevServer.ssrLoadModule("virtual:react-router/server-build")
    : await import("./build/server/index.js"),
  getLoadContext: (req) => {
    const host = req.get("Host");
    const tenant = req.subdomains.at(-1);
    const context = new RouterContextProvider();
    context.set(tenantContext, tenant);
    context.set(requestContext, { protocol: req.protocol, host });
    return context;
  },
});

const app = express();

app.use(compression());

// http://expressjs.com/en/advanced/best-practice-security.html#at-a-minimum-disable-x-powered-by-header
app.disable("x-powered-by");

app.get("/robots.txt", (req, res) => {
  const origin = `${req.protocol}://${req.get("Host")}`;
  const body =
    process.env.NODE_ENV === "production"
      ? `User-agent: *\nSitemap: ${origin}/sitemap.xml\n`
      : `User-agent: *\nDisallow: /\n`;
  res.set("Content-Type", "text/plain").send(body);
});

app.get("/sitemap.xml", async (req, res) => {
  const tenant = req.subdomains.at(-1);

  if (!tenant) {
    res.status(404).end();
    return;
  }

  try {
    const response = await fetch(
      `https://api.opentour.site/${tenant}/v4/public/tours`,
      {
        referrerPolicy: "strict-origin-when-cross-origin",
        method: "GET",
        mode: "cors",
        credentials: "include",
      },
    );
    const { tours } = await response.json();
    const origin = `${req.protocol}://${req.get("Host")}`;

    const urls = [
      origin,
      ...tours.flatMap((tour) => [
        `${origin}/${tour.slug}`,
        ...tour.stops.map((stop) => `${origin}/${tour.slug}/${stop.slug}`),
      ]),
    ];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((loc) => `  <url><loc>${loc}</loc></url>`).join("\n")}
</urlset>`;

    res.set("Content-Type", "application/xml").send(xml);
  } catch {
    res.status(500).end();
  }
});

// handle asset requests
if (viteDevServer) {
  app.use(viteDevServer.middlewares);
} else {
  // Vite fingerprints its assets so we can cache forever.
  app.use(
    "/assets",
    express.static("build/client/assets", { immutable: true, maxAge: "1y" }),
  );
}

// Everything else (like favicon.ico) is cached for an hour. You may want to be
// more aggressive with this caching.
app.use(express.static("build/client", { maxAge: "1h" }));

app.use(morgan("tiny"));

// handle SSR requests
app.all("*", handler);

const port = process.env.PORT || 4200; // Use 3443 (or 443) for HTTPS
const protocol = process.env.PROTOCOL || "http";
const keyPath = process.env.SSL_KEY || path.resolve("./.cert/key.pem");
const certPath = process.env.SSL_CERT || path.resolve("./.cert/cert.pem");

let sslOptions = {};

if (protocol === "https") {
  // Load SSL certificate & key
  sslOptions = {
    key: fs.readFileSync(keyPath),
    cert: fs.readFileSync(certPath),
  };
}

const startedMessage = () => {
  console.warn(
    `🚀 ${protocol.toUpperCase()} server running at ${protocol}://0.0.0.0:${port} (pid: ${
      process.pid
    })`,
  );
  console.warn(
    `For local subdomains, use a fully qualified domain (e.g. ${protocol}://lvh.me:${port}).`,
  );
};

// Start HTTPS server
if (protocol === "https") {
  https.createServer(sslOptions, app).listen(port, "0.0.0.0", () => {
    startedMessage();
  });
} else {
  http.createServer({}, app).listen(port, "0.0.0.0", () => {
    startedMessage();

    if (process.env.NODE_ENV !== "production") {
      const separator = "*".repeat(process.stdout.columns);
      const warning =
        "Server is running on HTTP. You will not be able to get the device location for directions.\n\n" +
        "To run the server using HTTPS set the `PROTOCOL` environment variable to 'HTTPS'.\n\n" +
        "See the README for more information about adding local certs.";
      console.warn(`\n${separator}`);
      console.warn(warning);
      console.warn(separator);
    }
  });
}
