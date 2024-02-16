export type TTourSet = {
  id: string | number;
  type: string;
  attributes: {
    name: string;
    subdir: string;
    published_tours: [
      {
        title: string;
        slug: string;
      },
      {
        title: string;
        slug: string;
      }
    ];
    mapable_tours: [
      {
        title: string;
        slug: string;
        center: {
          lat: number;
          lng: number;
        };
      },
      {
        title: string;
        slug: string;
        center: {
          lat: number;
          lng: number;
        };
      }
    ];
    logo_url: string | null;
    logo: {
      name: string;
      record: {
        id: string | number;
        name: string;
        created_at: string;
        updated_at: string;
        subdir: string;
        tour_id: string | number | null;
        external_url: string | null;
        notes: string | null;
        footer_logo: string | null;
        base_sixty_four: string | null;
        logo_title: string | null;
      };
    };
  };
  relationships: {
    admins: {
      data: [];
    };
  };
};
