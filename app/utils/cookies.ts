import type { TCookie, TCookieListItem, TCookieName } from "~/types/TCookies";

const getCookie = async ({ name, value, path = "/" }: TCookie) => {
  const cookies = await window.cookieStore.getAll(name);
  const cookie = cookies.find(
    (c: TCookieListItem) => c.path === path && c.value == value
  );
  return cookie;
};

export const cookieExists = async (args: TCookie) => {
  const cookie = await getCookie(args);
  return Boolean(cookie);
};

export const createCookie = ({
  name,
  value,
  path = "/",
  length = "year",
}: TCookie) => {
  const date = new Date();
  if (length == "day") date.setHours(date.getHours() + 24);
  if (length === "year") date.setFullYear(date.getFullYear() + 1);
  const cookieString = `${name}=${value}; path=${path}; expires=${date.toUTCString()}`;
  document.cookie = cookieString;
};

export const deleteCookie = ({ name, path = "/" }: TCookie) => {
  document.cookie = `${name}=; path=${path}; expires=${new Date()}`;
};

export const getCookieValue = async ({
  name,
  path = "/",
}: {
  name: TCookieName;
  path?: string;
}) => {
  const cookies = await window.cookieStore.getAll(name);
  const cookie = cookies.find((c: TCookieListItem) => c.path === path);
  return cookie?.value;
};

export const updateCookie = (args: TCookie) => {
  createCookie(args);
};
