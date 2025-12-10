import type { TStop } from "./TStop";
import type { TTravelMode } from "./TTravelMode";

export type TTourFlatPage = {
  title: string;
  position: number;
  slug: string;
  body: string;
};

export type TTourMedium = {
  caption: string;
  desktop_width: number;
  embed: string | undefined;
  filename: string;
  files: {
    lqip: string;
    mobile: string;
    tablet: string;
    desktop: string;
  };
  lqip_width: number | undefined;
  mobile_width: number;
  original_image: string;
  position: number;
  provider: string | undefined;
  tablet_width: undefined;
  title: string;
  video: string | undefined;
};

export type TTourStop = TStop & {
  next: { id: number; slug: string; title: string } | undefined;
  position: number;
  previous: { id: number; slug: string; title: string } | undefined;
};

export type TTour = {
  blank_map: boolean;
  bounds: {
    south: number;
    north: number;
    east: number;
    west: number;
    centerLat: number;
    centerLng: number;
  };
  default_lng: string;
  description: string;
  est_time: string | undefined;
  flat_pages: TTourFlatPage[];
  is_geo: boolean;
  link_address: string | undefined;
  link_text: string | undefined;
  map_overlay:
    | {
        east: string;
        image_url: string;
        north: string;
        south: string;
        west: string;
      }
    | undefined;
  map_type: "satellite" | "road" | "hybrid";
  media: TTourMedium[];
  modes: TTravelMode[];
  restrict_bounds: boolean;
  restrict_bounds_to_overlay: boolean;
  sanitized_description: string;
  splash: {
    title: string;
    caption: string;
    url: string;
  };
  slug: string;
  stop_count: number;
  stops: TTourStop[];
  tenant: string;
  title: string;
  theme: string;
  type: "tour";
  use_directions: boolean;
};
