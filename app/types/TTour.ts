import type { TStop } from "./TStop";
import type { TMedia } from "./TMedia";
import type { TTourFlatPage } from "./TTourFlatPage";

export type TTour = {
  id: number;
  type: string;
  stops: TStop[];
  flatPages: TTourFlatPage[];
  media: TMedia[];
  attributes: {
    title: string;
    slug: string;
    description: string;
    is_geo: boolean;
    published: boolean;
    sanitized_description: string;
    position: number | null;
    theme_title: string;
    meta_description: string | null;
    tenant: string;
    tenant_title: string;
    stop_count: number;
    map_type: string;
    splash: {
      title: string;
      caption: string | null;
      url: string;
    };
    use_directions: true;
    default_lng: string;
    est_time: string;
    link_address: string | null;
    link_text: string | null;
    restrict_bounds: false;
    restrict_bounds_to_overlay: boolean;
    blank_map: false;
    bounds: {
      south: number;
      north: number;
      east: number;
      west: number;
      centerLat: number;
      centerLng: number;
    };
  };
  relationships: {
    map_overlay: {
      data: string | null;
    };
    tour_modes: {
      data: [
        {
          id: string;
          type: string;
        },
        {
          id: string;
          type: string;
        },
        {
          id: string;
          type: string;
        },
        {
          id: string;
          type: string;
        },
        {
          id: string;
          type: string;
        }
      ];
    };
    tour_stops: {
      data: [
        {
          id: string;
          type: string;
        },
        {
          id: string;
          type: string;
        },
        {
          id: string;
          type: string;
        },
        {
          id: string;
          type: string;
        },
        {
          id: string;
          type: string;
        }
      ];
    };
    stops: {
      data: [
        {
          id: string;
          type: string;
        },
        {
          id: string;
          type: string;
        },
        {
          id: string;
          type: string;
        },
        {
          id: string;
          type: string;
        },
        {
          id: string;
          type: string;
        }
      ];
    };
    mode: {
      data: {
        id: string;
        type: string;
      };
    };
    theme: {
      data: {
        id: string;
        type: string;
      };
    };
    modes: {
      data: [
        {
          id: string;
          type: string;
        },
        {
          id: string;
          type: string;
        },
        {
          id: string;
          type: string;
        },
        {
          id: string;
          type: string;
        }
      ];
    };
    media: {
      data: [
        {
          id: string;
          type: string;
        }
      ];
    };
    tour_media: {
      data: [
        {
          id: string;
          type: string;
        }
      ];
    };
    flat_pages: {
      data: [];
    };
    tour_flat_pages: {
      data: [];
    };
    users: {
      data: [];
    };
  };
};

export type TPublishedTour = {
  title: string;
  slug: string;
  center: {
    lat: number;
    lng: number;
  };
};
