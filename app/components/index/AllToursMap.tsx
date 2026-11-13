import { useEffect, useState } from "react";
import { canUseWebGL } from "~/utils/webgl_check";
import ClientOnly from "../ClientOnly";
import TourMarkerLeaflet from "../shared/TourMarkerLeaflet.client";
import TourMarkerMapLibre from "../shared/TourMarkerMapLibre";
import "maplibre-gl/dist/maplibre-gl.css";
import AllToursLeaflet from "./AllToursLeaflet.client";
import AllToursMapLibre from "./AllToursMapLibre";
import type L from "leaflet";
import type { Map } from "maplibre-gl";
import type { TTourSetTour, TContextRequest } from "~/types";

interface Props {
  tours: TTourSetTour[];
  request: TContextRequest;
}

const AllToursMap = ({ tours, request }: Props) => {
  const [webglSupported, setWebglSupported] = useState<boolean | undefined>(
    undefined,
  );
  const [mapLibreMap, setMapLibreMap] = useState<Map | undefined>(undefined);
  const [leafletMap, setLeafletMap] = useState<L.Map | undefined>(undefined);

  useEffect(() => {
    setWebglSupported(canUseWebGL());
  }, []);

  if (webglSupported) {
    return (
      <AllToursMapLibre
        setWebglSupported={setWebglSupported}
        map={mapLibreMap}
        setMap={setMapLibreMap}
      >
        {tours.map((tour) => {
          return (
            <TourMarkerMapLibre key={tour.slug} tour={tour} map={mapLibreMap}>
              <a
                className="text-lg text-blue-700 hover:text-blue-900 underline"
                href={`${request.protocol}://${tour.tenant}.${request.host}/${tour.slug}`}
              >
                {tour.title}
              </a>
            </TourMarkerMapLibre>
          );
        })}
      </AllToursMapLibre>
    );
  } else if (webglSupported !== undefined && webglSupported === false) {
    return (
      <ClientOnly>
        <AllToursLeaflet setMap={setLeafletMap}>
          {tours.map((tour) => {
            return (
              <TourMarkerLeaflet key={tour.slug} map={leafletMap} tour={tour}>
                <a
                  className="text-lg text-blue-700 hover:text-blue-900 underline"
                  href={`${request.protocol}://${tour.tenant}.${request.host}/${tour.slug}`}
                >
                  {tour.title}
                </a>
              </TourMarkerLeaflet>
            );
          })}
        </AllToursLeaflet>
      </ClientOnly>
    );
  }

  return <></>;
};

export default AllToursMap;
