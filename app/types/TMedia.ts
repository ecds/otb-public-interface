export type TMedia = {
  id: string;
  type: string;
  attributes: {
    title: string | null;
    caption: string | null;
    video: string | null;
    provider: string | null;
    original_image: string;
    embed: string | null;
    files: {
      lqip: string;
      mobile: string;
      tablet: string;
      desktop: string;
    };
    orphaned: false;
    filename: string;
    original_image_url: string;
    lqip_width: string | null;
    mobile_width: number;
    tablet_width: number;
    desktop_width: number;
  };
};
