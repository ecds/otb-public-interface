import { Switch } from "@headlessui/react";
import { useContext } from "react";
import PermissionsContext from "~/contexts/PermissionsContext";
import type { ReactNode } from "react";
import type { TCookieUpdate } from "~/types/TCookies";

interface ToggleProps {
  cookie: boolean;
  children: ReactNode;
  disabled?: boolean;
  action: TCookieUpdate;
}

const CookieToggle = ({
  cookie,
  action,
  disabled = false,
  children,
}: ToggleProps) => {
  return (
    <>
      <button
        onClick={() => action(!cookie)}
        className="col-span-2 uppercase text-left"
        disabled={disabled}
      >
        {children}
      </button>
      <div>
        <Switch
          checked={cookie}
          className="group inline-flex h-6 w-11 items-center rounded-full bg-gray-300 transition data-checked:bg-green-600"
          onChange={() => action(!cookie)}
          disabled={disabled}
        >
          <span className="size-4 translate-x-1 rounded-full bg-white transition group-data-checked:translate-x-6" />
        </Switch>
      </div>
    </>
  );
};

const PermissionSettings = () => {
  const {
    locationAllowed,
    locationUpdateAllowed,
    setLocationAllowed,
    setLocationUpdateAllowed,
  } = useContext(PermissionsContext);

  return (
    <div className="grid grid-cols-3 gap-y-2 content-start">
      {typeof locationAllowed === "boolean" && (
        <CookieToggle cookie={locationAllowed} action={setLocationAllowed}>
          Share Location
        </CookieToggle>
      )}
      {typeof locationUpdateAllowed === "boolean" && (
        <CookieToggle
          cookie={locationUpdateAllowed}
          action={setLocationUpdateAllowed}
          disabled={!locationAllowed}
        >
          Update Location
        </CookieToggle>
      )}
    </div>
  );
};

export default PermissionSettings;
