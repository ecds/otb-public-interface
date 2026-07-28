export const checkPermissionState = async () => {
  if (!("geolocation" in navigator)) return "unavailable";
  if (!("permissions" in navigator)) return "prompt"; // older browsers

  try {
    const result = await navigator.permissions.query({ name: "geolocation" });
    return result.state; // 'granted' | 'denied' | 'prompt'
  } catch {
    return "prompt"; // query not supported (e.g. some mobile WebViews)
  }
};
