import {
  AdvancedMarker,
  InfoWindow,
  Pin,
  useAdvancedMarkerRef,
} from "@vis.gl/react-google-maps";
import { useCallback, useContext, useEffect, useState } from "react";
import { TourContext } from "~/contexts/TourContext";
import type { ReactNode } from "react";
import type { TStop } from "~/types/TStop";

interface Props {
  stop: TStop;
  children: ReactNode;
}

const MapMarker = ({ stop, children }: Props) => {
  const { currentStop, setCurrentStop } = useContext(TourContext);
  const [markerRef, marker] = useAdvancedMarkerRef();
  const [infoWindowShown, setInfoWindowShown] = useState<boolean>(false);
  const [position, setPosition] = useState<
    google.maps.LatLngLiteral | undefined
  >(undefined);

  const handleMarkerClick = useCallback(() => {
    setCurrentStop(stop);
  }, [setCurrentStop, stop]);

  const handleClose = useCallback(() => {
    setInfoWindowShown(false);
  }, []);

  useEffect(() => {
    const lat = parseFloat(stop.attributes.lat);
    const lng = parseFloat(stop.attributes.lng);

    // Skip if coordinates are invalid
    if (isNaN(lat) || isNaN(lng)) {
      console.error("Invalid coordinates for stop:", stop.attributes.title);
      return;
    }

    setPosition({ lat, lng });
  }, [stop]);

  useEffect(() => {
    setInfoWindowShown(stop === currentStop);
  }, [currentStop, stop]);

  if (position) {
    return (
      <>
        <AdvancedMarker
          ref={markerRef}
          position={position}
          onClick={handleMarkerClick}
          title={stop.attributes.title}
        >
          <Pin
            scale={1.1}
            background={"#ef4444"}
            borderColor={"#dc2626"}
            glyphColor="white"
          >
            <span className={`text-white font-bold text-sm`}>
              {stop.attributes.position}
            </span>
          </Pin>
        </AdvancedMarker>
        {infoWindowShown && (
          <InfoWindow anchor={marker} onCloseClick={handleClose}>
            {children}
          </InfoWindow>
        )}
      </>
    );
  }

  return <></>;
};

export default MapMarker;
