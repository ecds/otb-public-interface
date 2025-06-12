import {
  type RouteConfig,
  route,
  index,
} from "@react-router/dev/routes";

export default [
  index("routes/index.tsx"),
  route("tours", "routes/tours.tsx"),
  route(":tour", "routes/tour.tsx", [        
    route(":stop", "routes/stop.tsx"),       
  ]),
] satisfies RouteConfig;