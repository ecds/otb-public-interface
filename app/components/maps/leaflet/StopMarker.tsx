import { useStopMarker } from "~/hooks/useStopMarker";
import LeafletMarker from "./Marker";
import type Leaflet from "leaflet";
import type { TTourStop } from "~/types";

interface Props {
  L: typeof Leaflet;
  map: Leaflet.Map;
  stop: TTourStop;
}

const StopMarker = ({ L, map, stop }: Props) => (
  <LeafletMarker L={L} map={map} {...useStopMarker(stop)} />
);

export default StopMarker;
