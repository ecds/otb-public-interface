import {  route, index } from "@react-router/dev/routes";
import type {RouteConfig} from "@react-router/dev/routes";

export default [
  index("./routes/index.tsx"),
  route("tours", "./routes/tours.tsx"),
  route(":tour", "./routes/tour.tsx", [
    index("./routes/tour/tour-index.tsx"),
    route("intro", "./routes/tour/tour-intro.tsx"),
    route("map", "./routes/tour/tour-map.tsx"),
    route("stops", "./routes/tour/tour-stops.tsx"),
    route(":stop", "./routes/stop.tsx", [
      index("./routes/stop/stop-index.tsx"),
      route("intro", "./routes/stop/stop-intro.tsx"),
      route("map", "./routes/stop/stop-map.tsx"),
    ]),
  ]),
] satisfies RouteConfig;
