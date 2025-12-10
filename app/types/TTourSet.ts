export type TTourSetTour = {
  title: string;
  slug: string;
  center: {
    lat: number;
    lng: number;
  };
};

export type TTourSet = {
  id: string | number;
  name: string;
  subdir: string;
  mapable_tours: TTourSetTour[];
  logo_url: string | null;
};
