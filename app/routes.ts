import {
  type RouteConfig,
  route,
  index,
} from "@react-router/dev/routes";

export default [
  index("routes/_index.tsx"),
  route("tours", "routes/tours.tsx"),
  route(":tour", "routes/$tour.tsx", [
    route(":stop", "routes/$tour.$stop.tsx"),
  ]),
] satisfies RouteConfig;