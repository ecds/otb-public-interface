import { API_URL } from "~/utils/apiUrl";

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

export const getTourSets = async () => {
  const response = await fetchData(
    `${API_URL}/public/v4/public/tour-sets`,
  );
  return await response;
};

export const getTourSet = async (tenant: string) => {
  const response = await fetchData(
    `${API_URL}/public/tour-sets?subdir=${tenant}`,
  );
  return response.data[0];
};

export const getTours = async (tenant: string) => {
  const response = await fetchData(
    `${API_URL}/${tenant}/v4/public/tours`,
  );
  return response;
};

export const isSignedIn = async () => {
  const response = await fetchData(
    `${API_URL}/public/users?me=true`,
  );
  return Boolean(response.data.id);
};

export const getTour = async (tenant: string, tour: number | string) => {
  const response = await fetchData(
    `${API_URL}/${tenant}/v4/public/tours/${tour}`,
  );
  return response;
};
