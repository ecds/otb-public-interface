import type { TMedia } from "./TMedia";

export type TStop = {
  id: string | number;
  type: string;
  media: TMedia[];
  attributes: {
    title: string;
    slug: string;
    description: string;
    sanitized_description: string;
    sanitized_direction_notes: string;
    lat: string;
    lng: string;
    address: string | null;
    meta_description: string;
    article_link: string;
    video_embed: string | null;
    video_poster: string | null;
    parking_lat: number | null;
    parking_lng: number | null;
    direction_intro: string;
    direction_notes: string | null;
    splash: {
      title: string;
      caption: string;
      url: string;
    };
    orphaned: false;
    icon_color: string;
    position: number;
    previous: {
      id: number;
      tour_id: number;
      stop_id: number;
      position: number;
      created_at: string;
      updated_at: string;
    };
    next: {
      id: number;
      tour_id: number;
      stop_id: number;
      position: number;
      created_at: string;
      updated_at: string;
    };
    next_slug: string;
    previous_slug: string;
  };
  relationships: {
    tour: {
      data: {
        id: string | number;
        type: string;
      };
    };
    stop: {
      data: {
        id: string | number;
        type: string;
      };
    };
  };
  included: [
    {
      id: string | number;
      type: string;
      attributes: {
        title: string;
        slug: string;
        description: string;
        sanitized_description: string;
        sanitized_direction_notes: string;
        lat: string;
        lng: string;
        address: string | null;
        meta_description: string;
        article_link: string;
        video_embed: string | null;
        video_poster: string | null;
        parking_lat: string;
        parking_lng: string;
        direction_intro: string;
        direction_notes: string | null;
        splash: {
          title: string;
          caption: string;
          url: string;
        };
        orphaned: false;
        icon_color: string;
      };
      relationships: {
        media: {
          data: [
            {
              id: string | number;
              type: string;
            },
            {
              id: string | number;
              type: string;
            },
            {
              id: string | number;
              type: string;
            },
            {
              id: string | number;
              type: string;
            },
            {
              id: string | number;
              type: string;
            },
            {
              id: string | number;
              type: string;
            },
            {
              id: string | number;
              type: string;
            }
          ];
        };
        stop_media: {
          data: [
            {
              id: string | number;
              type: string;
            },
            {
              id: string | number;
              type: string;
            },
            {
              id: string | number;
              type: string;
            },
            {
              id: string | number;
              type: string;
            },
            {
              id: string | number;
              type: string;
            },
            {
              id: string | number;
              type: string;
            },
            {
              id: string | number;
              type: string;
            }
          ];
        };
        tours: {
          data: [
            {
              id: string | number;
              type: string;
            }
          ];
        };
        map_icon: {
          data: string | null;
        };
      };
    }
  ];
};

export type TTourStop = {
  id: string | number;
  type: string;
  stop: TStop;
  attributes: {
    position: number;
    previous: {
      id: number;
      tour_id: number;
      stop_id: number;
      position: number;
      created_at: string;
      updated_at: string;
    };
    slug: string;
    next: {
      id: number;
      tour_id: number;
      stop_id: number;
      position: number;
      created_at: string;
      updated_at: string;
    };
    next_slug: string;
    previous_slug: string;
  };
  relationships: {
    tour: {
      data: {
        id: string | number;
        type: string;
      };
    };
    stop: {
      data: {
        id: string | number;
        type: string;
      };
    };
  };
};
