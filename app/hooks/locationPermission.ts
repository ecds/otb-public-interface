import { useEffect, useState } from "react";

export const useLocationPermission = () => {
  const [state, setState] = useState("pending");

  useEffect(() => {
    navigator.permissions.query({ name: "geolocation" }).then((status) => {
      setState(status.state);
      const handler = () => setState(status.state);
      status.addEventListener("change", handler);
      return () => status.removeEventListener("change", handler);
    });
  }, []);

  return state; // 'granted' | 'denied' | 'prompt' | 'pending'
};
