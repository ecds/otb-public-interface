import { APIProvider, Map } from "@vis.gl/react-google-maps";
import MapMarker from "../MapMarker";
import type { TTourSetTour } from "~/types/TTourSet";

interface Props {
  tours: TTourSetTour[];
}

const AllToursMap = ({ tours }: Props) => {
  const position = { lat: 32.6620411, lng: -83.4375901 };

  return (
    <div className="w-full max-w-screen h-[50vh]">
      <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
        <Map
          defaultCenter={position}
          defaultZoom={6}
          disableDefaultUI
          mapId={"bf51a910020fa25a"}
          fullscreenControl
          // fullscreenControlOptions={{ position: ControlPosition.TOP_LEFT }}
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
        </Map>
      </APIProvider>
    </div>
  );
};

export default AllToursMap;
