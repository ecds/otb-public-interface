export type TTourSetTour = {
  title: string;
  slug: string;
  center: {
    lat: number;
    lng: number;
  };
};

export type TTourSetPreview = {
  id: string | number;
  description: string;
  name: string;
  subdir: string;
  logo_url: string | null;
};

export type TTourSet = TTourSetPreview & {
  mapable_tours: TTourSetTour[];
  published_tours: TTourSetTour[];
};
