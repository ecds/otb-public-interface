import type { TTourMedium } from "./TTour";

export type TStop = {
  address: string;
  article_link: string | undefined;
  description: string;
  direction_intro: string | undefined;
  direction_notes: string | undefined;
  icon_color: string;
  id: string | number;
  lat: number;
  lng: number;
  map_icon: string | undefined;
  media: TTourMedium[];
  meta_description: string;
  parking_lat: number | undefined;
  parking_lng: number | undefined;
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
