import type { TTour } from "./types/TTour";

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

export const getStop = async (tenant: string, stop: number) => {
  const response = await fetchData(
    `https://api.opentour.site/${tenant}/v4/stops/${stop}`
  );
  return response.data;
};

export const getTourSets = async () => {
  const response = await fetchData(
    "https://api.opentour.site/public/v4/tour-sets"
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
  const response = await fetchData(
    `https://api.opentour.site/${tenant}/v4/tours`
  );
  return response.data;
};

export const isSignedIn = async () => {
  const response = await fetchData(
    "https://api.opentour.site/public/users?me=true"
  );
  return Boolean(response.data.id);
};

export const getTour = async (tenant: string, tour: number | string) => {
  const response = await fetchData(
    `https://api.opentour.site/${tenant}/v4/tours?slug=${tour}`
  );
  const tourData: TTour = response.data;
  return { tour: tourData };
};

export const getRelatedData = async ({
  tenant,
  id,
  relationship,
}: {
  tenant: string;
  id: string;
  relationship: string;
}) => {
  const response = await fetchData(
    `https://api.opentour.site/${tenant}/v4/${relationship}/${id}`
  );
  return response;
};
