import {
  AdvancedMarker,
  InfoWindow,
  Pin,
  useAdvancedMarkerRef,
} from "@vis.gl/react-google-maps";
import { useContext, useState } from "react";
import { TourContext } from "~/contexts/TourContext";

const StopMarker = () => {
  const { currentStop } = useContext(TourContext);
  const [infoWindowShown, setInfoWindowShown] = useState<boolean>(false);
  const [markerRef, marker] = useAdvancedMarkerRef();

  if (currentStop) {
    return (
      <>
        <AdvancedMarker
          position={{ lat: currentStop.lat, lng: currentStop.lng }}
          ref={markerRef}
          onClick={() => setInfoWindowShown(true)}
        >
          <Pin scale={1}>
            <span className="text-white text-lg">{currentStop.position}</span>
          </Pin>
        </AdvancedMarker>
        {infoWindowShown && (
          <InfoWindow
            anchor={marker}
            onCloseClick={() => setInfoWindowShown(false)}
          >
            <h2>{currentStop.title}</h2>
          </InfoWindow>
        )}
      </>
    );
  }

  return <></>;
};

export default StopMarker;
