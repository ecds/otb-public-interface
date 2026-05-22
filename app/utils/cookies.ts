import type { TCookie, TCookieName } from "~/types/TCookies";

export const sitePreferences = () => {
  const sitePrefs = preferences("OpenTour");
  if (sitePrefs) {
    return sitePrefs;
  } else {
    return setPreferences("OpenTour", []);
  }
};

export const preferences = (storeKey: string) => {
  try {
    const raw = localStorage.getItem(storeKey);
    if (raw) return JSON.parse(raw);
  } catch {
    console.warn("Could not access local storage");
  }

  return null;
};

export const setPreferences = (storeKey: string, preferences: TCookie) => {
  try {
    localStorage.setItem(storeKey, JSON.stringify(preferences));
    return preferences;
  } catch {
    console.warn("Could not access local storage");
  }

  return null;
};

export const cookies: {
  id: TCookieName;
  label: string;
  required: boolean;
  description: string;
  detail?: string;
  thirdParty?: boolean | undefined;
  dependsOn?: TCookieName | undefined;
}[] = [
  {
    id: "functional" as TCookieName,
    label: "Functional",
    required: true,
    description:
      "Remembers that you've made a cookie choice so this banner doesn't reappear. No personal data is collected.",
  },
  {
    id: "analyticsAllowed" as TCookieName,
    label: "Anonymous analytics",
    required: false,
    description:
      "Counts unique visits, total visits, and broad geographic region (country/region only) via Matomo, self-hosted on our own servers. No names, emails, or precise locations are recorded. Data is never sold or shared.",
    detail: "Matomo · self-hosted · no third-party access",
    thirdParty: false,
  },
  {
    id: "gMaps" as TCookieName,
    label: "Google Maps",
    required: false,
    description:
      "Enables interactive maps on this site. Maps are served by Google, which may collect your IP address and usage data under its own privacy policy. No maps load until you enable this.",
    detail: "Third party: Google LLC · google.com/policies/privacy",
    thirdParty: true,
  },
  {
    id: "locationAllowed" as TCookieName,
    label: "Share location",
    required: false,
    description:
      "Uses your browser's geolocation API to provide locally relevant content. Your location is not stored on our servers.",
    thirdParty: false,
  },
  {
    id: "realtimeLocation" as TCookieName,
    label: "Real-time location updates",
    required: false,
    description:
      "Continuously updates your location while you browse. Requires 'Share location'. If Google Maps is also enabled, your live location may be sent to Google.",
    dependsOn: "locationAllowed",
    thirdParty: false,
  },
];
