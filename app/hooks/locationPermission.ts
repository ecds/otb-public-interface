import { useEffect, useState } from "react";

export const useLocationPermission = () => {
  const [state, setState] = useState("pending");

  useEffect(() => {
    let status: PermissionStatus | undefined;
    const handler = () => setState(status!.state);

    navigator.permissions.query({ name: "geolocation" }).then((s) => {
      status = s;
      setState(s.state);
      s.addEventListener("change", handler);
    });

    return () => {
      status?.removeEventListener("change", handler);
    };
  }, []);

  return state; // 'granted' | 'denied' | 'prompt' | 'pending'
};
