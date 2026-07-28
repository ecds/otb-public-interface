import { createCookie } from "react-router";

export const userPrefs = createCookie("user-prefs", {
  maxAge: 31_536_000, // one year,
  secure: true,
});
