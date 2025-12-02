import { useEffect, useState } from "react";
import type { TCookie, TCookieListItem, TCookieName } from "../types/TCookies";

export const useCookie = ({ name, value, path = "/" }: TCookie) => {
  const [isSet, setIsSet] = useState<boolean>();

  useEffect(() => {
    const getCookie = async () => {
      const cookies = await window.cookieStore.getAll(name);
      const cookie = cookies.find(
        (c: TCookieListItem) => c.path === path && c.value == value
      );
      setIsSet(Boolean(cookie));
    };

    getCookie();
  }, [name, path, value]);

  useEffect(() => {
    const createCookie = () => {
      const date = new Date();
      date.setFullYear(date.getFullYear() + 1);
      document.cookie = `${name}=${value}; path=${path}; expires=${date}`;
    };
    const deleteCookie = () => {
      document.cookie = `${name}=; path=${path}; expires=${new Date()}`;
    };

    if (isSet === undefined) return;
    if (isSet) createCookie();
    if (!isSet) deleteCookie();
  }, [isSet, name, value, path]);

  const toggleCookie = () => {
    if (isSet === undefined) return;
    setIsSet(!isSet);
  };

  const setCookie = () => setIsSet(true);
  const deleteCookie = () => setIsSet(false);

  return { isSet, toggleCookie, setCookie, deleteCookie };
};

export const useGlobalCookies = () => {
  const cookiesAcknowledged = useCookie({
    name: "cookies-acknowledged",
    value: "acknowledged",
  });

  const locationAllowed = useCookie({
    name: "location-allowed",
    value: "allowed",
  });

  const updateLocation = useCookie({
    name: "update-location",
    value: "allowed",
  });

  const acceptAll = () => {
    cookiesAcknowledged.setCookie();
    locationAllowed.setCookie();
    updateLocation.setCookie();
  };

  const rejectAll = () => {
    cookiesAcknowledged.setCookie();
    locationAllowed.deleteCookie();
    updateLocation.deleteCookie();
  };

  return {
    cookiesAcknowledged,
    locationAllowed,
    updateLocation,
    acceptAll,
    rejectAll,
  };
};

export const useCookieValue = ({
  name,
  path = "/",
}: {
  name: TCookieName;
  path?: string;
}) => {
  const [value, setValue] = useState<string | undefined>(undefined);
  useEffect(() => {
    const getCookie = async () => {
      const cookies = await window.cookieStore.getAll(name);
      const cookie = cookies.find((c: TCookieListItem) => c.path === path);
      setValue(cookie?.name);
    };

    getCookie();
  }, [name, path]);

  return value;
};
