import { useStopMarker } from "~/hooks/useStopMarker";
import MapLibreMarker from "./Marker";
import type { Map } from "maplibre-gl";
import type { TTourStop } from "~/types";

const StopMarker = ({ map, stop }: { map: Map; stop: TTourStop }) => (
  <MapLibreMarker map={map} {...useStopMarker(stop)} />
);

export default StopMarker;
