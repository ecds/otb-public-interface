import type { TPreferenceName } from "~/types";

interface Props {
  gMaps: boolean;
  locationAllowed: boolean;
  addPreference: (pref: TPreferenceName) => void;
}

const COPY: Record<string, string> = {
  both: "Enable Google Maps and share your location to get turn-by-turn directions.",
  locationOnly: "Share your location to get turn-by-turn directions.",
  mapsOnly: "Enable Google Maps to see your route on the map.",
};

const MapNudge = ({ gMaps, locationAllowed, addPreference }: Props) => {
  if (gMaps && locationAllowed) return null;

  const key = !gMaps && !locationAllowed ? "both" : !locationAllowed ? "locationOnly" : "mapsOnly";

  const handleEnable = () => {
    if (!gMaps) addPreference("gMaps");
    if (!locationAllowed) addPreference("locationAllowed");
  };

  return (
    <div className="md:hidden flex items-center justify-between gap-3 px-4 py-2 text-xs text-black/60">
      <span>{COPY[key]}</span>
      <button
        onClick={handleEnable}
        className="shrink-0 bg-blue-500 text-white rounded-md px-3 py-1"
      >
        Enable
      </button>
    </div>
  );
};

export default MapNudge;
