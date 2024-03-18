import { useState, useEffect } from "react";
import {
  APIProvider,
  ControlPosition,
  Map,
  MapControl,
} from "@vis.gl/react-google-maps";
import MapMarker from "../MapMarker";
import type { TPublishedTour } from "~/types/TTour";

interface Props {
  tours: TPublishedTour[];
}

const AllToursMap = ({ tours }: Props) => {
  const position = { lat: 32.6620411, lng: -83.4375901 };
  const [expandMap, setExpandMap] = useState(false);
  const [zoom, setZoom] = useState(6);

  useEffect(() => {
    if (!expandMap) setZoom(6);
  }, [expandMap]);

  return (
    <div className="w-screen h-[50vh]">
      <APIProvider apiKey={"AIzaSyD-G_lDtvChv-P3nchtQYHoCLfFzn9ylr8"}>
        <Map
          defaultCenter={position}
          zoom={expandMap ? 2 : zoom}
          disableDefaultUI
          mapId={"bf51a910020fa25a"}
          onZoomChanged={({ detail }) => setZoom(detail.zoom)}
        >
          {tours.map((tour) => {
            return (
              <MapMarker
                key={tour.slug}
                position={tour.center}
                title={tour.title}
              >
                {tour.title}
              </MapMarker>
            );
          })}
          <MapControl position={ControlPosition.BOTTOM_RIGHT}>
            <button onClick={() => setExpandMap(!expandMap)}>Expand</button>
          </MapControl>
        </Map>
      </APIProvider>
    </div>
  );
};

export default AllToursMap;
