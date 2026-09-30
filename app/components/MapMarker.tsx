import {
  AdvancedMarker,
  InfoWindow,
  useAdvancedMarkerRef,
} from "@vis.gl/react-google-maps";
import { useState } from "react";
import type { ReactNode } from "react";

interface Props {
  title: string;
  position: google.maps.LatLngLiteral;
  children: ReactNode;
}

const MapMarker = ({ title, position, children }: Props) => {
  const [infowindowOpen, setInfowindowOpen] = useState(false);
  const [markerRef, marker] = useAdvancedMarkerRef();

  return (
    <>
      <AdvancedMarker
        ref={markerRef}
        onClick={() => setInfowindowOpen(true)}
        position={position}
        title={title}
      />
      {infowindowOpen && (
        <InfoWindow
          anchor={marker}
          maxWidth={200}
          onCloseClick={() => setInfowindowOpen(false)}
        >
          <p>{children}</p>
        </InfoWindow>
      )}
    </>
  );
};

export default MapMarker;