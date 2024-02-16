import type { TTourStop } from "./types/TStop";
import type { TMedia } from "./types/TMedia";
import type { TTourFlatPage } from "./types/TTourFlatPage";

const fetchData = async (url: string) => {
  const response = await fetch(url, {
    referrerPolicy: "strict-origin-when-cross-origin",
    body: null,
    method: "GET",
    mode: "cors",
    credentials: "include",
  });

  const data = await response.json();
  return data;
};

export const getFlatPage = async (
  tenant: string,
  flatPageId: string | number
) => {
  const response = await fetchData(
    `https://api.opentour.site/${tenant}/flat-pages/${flatPageId}`
  );
  return response.data;
};

export const getTourFlatPage = async (
  tenant: string,
  tourFlatPage: number | string
) => {
  const response = await fetchData(
    `https://api.opentour.site/${tenant}/tour-flat-pages/${tourFlatPage}`
  );
  const flatPage = await getFlatPage(
    tenant,
    response.data.relationships.flat_page.data.id
  );
  response.data.attributes = {
    ...response.data.attributes,
    ...flatPage.attributes,
  };
  return response.data;
};

export const getMedium = async (tenant: string, mediaId: string | number) => {
  const response = await fetchData(
    `https://api.opentour.site/${tenant}/media/${mediaId}`
  );
  return response.data;
};

export const getTourMedium = async (
  tenant: string,
  tourMedium: number | string
) => {
  const response = await fetchData(
    `https://api.opentour.site/${tenant}/tour-media/${tourMedium}`
  );
  const medium = await getMedium(
    tenant,
    response.data.relationships.medium.data.id
  );
  response.data.attributes = {
    ...response.data.attributes,
    ...medium.attributes,
  };
  return response.data;
};

export const getStopMedium = async (
  tenant: string,
  tourMedium: number | string
) => {
  const response = await fetchData(
    `https://api.opentour.site/${tenant}/stop-media/${tourMedium}`
  );
  const medium = await getMedium(
    tenant,
    response.data.relationships.medium.data.id
  );
  response.data.attributes = {
    ...response.data.attributes,
    ...medium.attributes,
  };
  return response.data;
};

export const getStop = async (tenant: string, stop: number) => {
  const response = await fetchData(
    `https://api.opentour.site/${tenant}/stops/${stop}`
  );
  let stopMedia = await Promise.all(
    response.data.relationships.stop_media.data?.map(async (medium: TMedia) => {
      return getStopMedium(tenant, medium.id);
    })
  );

  stopMedia = stopMedia.sort((a, b) => {
    return a.attributes.position - b.attributes.position;
  });

  response.data.media = stopMedia;
  return response.data;
};

export const getTourStop = async (
  tenant: string,
  tourStop: number | string
) => {
  const response = await fetchData(
    `https://api.opentour.site/${tenant}/tour-stops/${tourStop}`
  );

  let stop = await getStop(tenant, response.data.relationships.stop.data.id);

  stop.attributes = {
    ...response.data.attributes,
    ...stop.attributes,
  };
  return stop;
};

export const queryTourStop = async (
  tenant: string,
  tourStop: string,
  tourId: string | number
) => {
  const response = await fetchData(
    `https://api.opentour.site/${tenant}/tour-stops/?slug-${tourStop}&tour=${tourId}`
  );
  response.data.stop = await getStop(
    tenant,
    response.data.relationships.stop.data.id
  );
  return response.data;
};

export const getTourSets = async () => {
  const response = await fetchData(
    "https://api.opentour.site/public/tour-sets"
  );
  return response.data;
};

export const getTourSet = async (tenant: string) => {
  const response = await fetchData(
    `https://api.opentour.site/public/tour-sets?subdir=${tenant}`
  );
  return response.data[0];
};

export const getTours = async (tenant: string) => {
  const response = await fetchData(`https://api.opentour.site/${tenant}/tours`);
  return response.data;
};

export const getTour = async (tenant: string, tour: number | string) => {
  const response = await fetchData(
    `https://api.opentour.site/${tenant}/tours?slug=${tour}`
  );

  let tourStops = await Promise.all(
    response.data.relationships.tour_stops.data.map(
      async (tourStop: TTourStop) => {
        return getTourStop(tenant, tourStop.id);
      }
    )
  );

  tourStops = tourStops.sort((a, b) => {
    return a.attributes.position - b.attributes.position;
  });

  response.data.stops = tourStops;

  let tourFlatPages = await Promise.all(
    response.data.relationships.tour_flat_pages.data?.map(
      async (flatPage: TTourFlatPage) => {
        return getTourFlatPage(tenant, flatPage.id);
      }
    )
  );

  tourFlatPages = tourFlatPages.sort((a, b) => {
    return a.attributes.position - b.attributes.position;
  });

  response.data.flatPages = tourFlatPages;

  let tourMedia = await Promise.all(
    response.data.relationships.tour_media.data?.map(async (medium: TMedia) => {
      return getTourMedium(tenant, medium.id);
    })
  );

  tourMedia = tourMedia.sort((a, b) => {
    return a.attributes.position - b.attributes.position;
  });

  response.data.media = tourMedia;

  return { tour: response.data };
};
