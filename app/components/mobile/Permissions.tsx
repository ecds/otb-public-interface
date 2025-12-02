import PermissionsContext from "~/contexts/PermissionsContext";
import { useEffect, useState, type ReactNode } from "react";
import { createCookie, deleteCookie, getCookieValue } from "~/utils/cookies";

interface Props {
  children: ReactNode;
}

const Permissions = ({ children }: Props) => {
  const [cookiesAcknowledged, setCookiesAcknowledged] = useState<
    boolean | undefined
  >(undefined);
  const [locationAllowed, setLocationAllowed] = useState<boolean | undefined>(
    undefined
  );
  const [locationUpdateAllowed, setLocationUpdateAllowed] = useState<
    boolean | undefined
  >(undefined);

  useEffect(() => {
    const checkCookies = async () => {
      const locationAllowedCookie = await getCookieValue({
        name: "location-allowed",
      });
      const locationUpdateAllowedCookie = await getCookieValue({
        name: "update-location",
      });
      const cookiesAcknowledgedCookie = await getCookieValue({
        name: "cookies-acknowledged",
      });
      setLocationAllowed(locationAllowedCookie === "allowed");
      setLocationUpdateAllowed(locationUpdateAllowedCookie === "allowed");
      setCookiesAcknowledged(cookiesAcknowledgedCookie === "acknowledged");
    };

    checkCookies();

    return () => {
      setLocationAllowed(undefined);
      setLocationUpdateAllowed(undefined);
      setCookiesAcknowledged(undefined);
    };
  }, []);

  useEffect(() => {
    if (typeof cookiesAcknowledged === "undefined" || !locationAllowed) return;

    const length = locationAllowed ? "year" : "day";

    createCookie({
      name: "cookies-acknowledged",
      value: "acknowledged",
      length,
    });
  }, [cookiesAcknowledged, locationAllowed]);

  useEffect(() => {
    if (typeof locationAllowed === "undefined") return;

    if (locationAllowed) {
      createCookie({ name: "location-allowed", value: "allowed" });
      setCookiesAcknowledged(true);
    }
    if (!locationAllowed) {
      deleteCookie({ name: "location-allowed", value: "allowed" });
    }
  }, [locationAllowed]);

  useEffect(() => {
    if (typeof locationAllowed === "undefined") return;

    if (!locationAllowed && cookiesAcknowledged) {
      createCookie({
        name: "cookies-acknowledged",
        value: "acknowledged",
        length: "day",
      });
    }
  }, [locationAllowed, cookiesAcknowledged]);

  useEffect(() => {
    if (typeof locationUpdateAllowed === "undefined") return;

    if (locationUpdateAllowed) {
      createCookie({ name: "update-location", value: "allowed" });
      setLocationAllowed(true);
    }
    if (!locationUpdateAllowed)
      deleteCookie({ name: "update-location", value: "allowed" });
  }, [locationUpdateAllowed]);

  useEffect(() => {
    if (!locationAllowed) setLocationUpdateAllowed(false);
  }, [locationAllowed]);

  if (
    typeof locationAllowed === "boolean" &&
    typeof locationUpdateAllowed === "boolean"
  ) {
    return (
      <PermissionsContext.Provider
        value={{
          cookiesAcknowledged,
          locationAllowed,
          locationUpdateAllowed,
          setCookiesAcknowledged,
          setLocationAllowed,
          setLocationUpdateAllowed,
        }}
      >
        {children}
      </PermissionsContext.Provider>
    );
  }

  return <></>;
};

export default Permissions;
