export type TOverlay = {
  id: string;
  type: "map_overlays";
  attributes: {
    south: string;
    north: string;
    east: string;
    west: string;
    original_image_url: string;
    filename: string;
  };
};
