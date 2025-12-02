import { createContext } from "react";
import type { SetStateAction } from "react";
import type { TCookieUpdate } from "~/types/TCookies";

interface Context {
  cookiesAcknowledged: boolean | undefined;
  locationAllowed: boolean | undefined;
  locationUpdateAllowed: boolean | undefined;
  setLocationAllowed: TCookieUpdate;
  setLocationUpdateAllowed: TCookieUpdate;
  setCookiesAcknowledged: TCookieUpdate;
}

const PermissionsContext = createContext<Context>({
  cookiesAcknowledged: undefined,
  locationAllowed: undefined,
  locationUpdateAllowed: undefined,
  setCookiesAcknowledged: (_: SetStateAction<boolean | undefined>) => {
    console.error(
      "setCookiesAcknowledged not implemented. Did you pass it to context?"
    );
  },
  setLocationAllowed: (_: SetStateAction<boolean | undefined>) => {
    console.error(
      "setLocationAllowed not implemented. Did you pass it to context?"
    );
  },
  setLocationUpdateAllowed: (_: SetStateAction<boolean | undefined>) => {
    console.error(
      "setLocationUpdateAllowed not implemented. Did you pass it to context?"
    );
  },
});

export default PermissionsContext;
