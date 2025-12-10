import type { TTourMedium } from "./TTour";

export type TStop = {
  address: string;
  article_link: string | undefined;
  description: string;
  direction_intro: string | undefined;
  direction_notes: string | undefined;
  icon: string | undefined;
  icon_color: string;
  lat: string;
  lng: string;
  media: TTourMedium[];
  meta_description: string;
  parking_lat: string | undefined;
  parking_lng: string | undefined;
  sanitized_description: string;
  slug: string;
  splash: {
    caption: string;
    title: string;
    url: string;
  };
  title: string;
  type: "stop";
  video_embed: string | undefined;
  video_poster: string | undefined;
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
