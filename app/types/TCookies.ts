import type { TTravelModeTitle } from "./TTravelMode";
import type { Dispatch, SetStateAction } from "react";

export type TCookieName =
  | "cookies-acknowledged"
  | "location-allowed"
  | "update-location"
  | "transportation-mode";

export type TCookieValue = "allowed" | "acknowledged" | TTravelModeTitle;

export type TCookie = {
  name: TCookieName;
  value: TCookieValue;
  path?: string;
  length?: "day" | "year";
};

export type TCookieListItem = CookieListItem & {
  path?: string;
};

export type TCookieHook = {
  toggleCookie: () => void;
  isSet: boolean | undefined;
  setCookie: () => void;
  deleteCookie: () => void;
};

export type TCookieUpdate = Dispatch<SetStateAction<boolean | undefined>>;
