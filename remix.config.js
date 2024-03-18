/** @type {import('@remix-run/dev').AppConfig} */
export default {
  ignoredRouteFiles: ["**/.*"],
  serverModuleFormat: "esm",
  tailwind: true,
  server: "server.ts",
  publicPath: "/_static/build/",
  serverBuildPath: "server/index.mjs",
  serverDependenciesToBundle: [/^remix-utils.*/],
  // appDirectory: "app",
  // assetsBuildDirectory: "public/build",
  // publicPath: "/build/",
  // serverBuildPath: "build/index.js",
};
