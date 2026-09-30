import type { TPreference, TPreferenceList, TPreferenceName } from "~/types";

const STORAGE_KEY = "OpenTour";

export const getPreferences = (): TPreferenceName[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    console.warn("Could not access local storage");
  }
  return ["functional"];
};

export const hasSetPreferences = (): boolean => {
  try {
    return localStorage.getItem(STORAGE_KEY) !== null;
  } catch {
    return false;
  }
};

export const savePreferences = (prefs: TPreferenceList): TPreferenceList => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  } catch {
    console.warn("Could not access local storage");
  }
  return prefs;
};

export const cookies: TPreference[] = [
  {
    id: "functional",
    label: "Functional",
    required: true,
    description:
      "Remembers that you've made a cookie choice so this banner doesn't reappear. No personal data is collected.",
  },
  {
    id: "analyticsAllowed",
    label: "Anonymous analytics",
    required: false,
    description:
      "Counts unique visits, total visits, and broad geographic region (country/region only) via Matomo, self-hosted on our own servers. No names, emails, or precise locations are recorded. Data is never sold or shared.",
    detail: "Matomo · self-hosted · no third-party access",
    thirdParty: false,
  },
  {
    id: "gMaps",
    label: "Google Maps",
    required: false,
    description:
      "Enables interactive maps on this site. Maps are served by Google, which may collect your IP address and usage data under its own privacy policy. No maps load until you enable this.",
    detail: "Third party: Google LLC · google.com/policies/privacy",
    thirdParty: true,
  },
  {
    id: "locationAllowed",
    label: "Share location",
    required: false,
    description:
      "Uses your browser's geolocation API to provide locally relevant content. Your location is not stored on our servers.",
    thirdParty: false,
  },
  {
    id: "realtimeLocation",
    label: "Real-time location updates",
    required: false,
    description:
      "Continuously updates your location while you browse. Requires 'Share location'. If Google Maps is also enabled, your live location may be sent to Google.",
    dependsOn: "locationAllowed",
    thirdParty: false,
  },
  {
    id: "thirdPartyEmbeds",
    label: "3rd Party Embeds",
    required: false,
    description:
      "View content that is hosted by a third party. Loading it will connect you to their servers and may set cookies.",
    thirdParty: true,
  },
];

export const allPreferenceNames: TPreferenceName[] = cookies.map((c) => c.id);
