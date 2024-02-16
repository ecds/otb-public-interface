export type TTourFlatPage = {
  id: string | number;
  type: string;
  attributes: {
    position: number;
    title: string;
    body: string;
    slug: string;
    orphaned: false;
  };
  relationships: {
    tour: {
      data: {
        id: string;
        type: string;
      };
    };
    flat_page: {
      data: {
        id: string;
        type: string;
      };
    };
  };
};
