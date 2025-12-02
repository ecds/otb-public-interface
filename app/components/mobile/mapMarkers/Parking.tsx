import { faSquareParking } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AdvancedMarker } from "@vis.gl/react-google-maps";
import { useContext } from "react";
import { StopMapContext } from "~/contexts/StopMapContext";

const ParkingMarker = () => {
  const { parkingLocation, travelMode } = useContext(StopMapContext);

  if (parkingLocation && travelMode.title === "DRIVING") {
    return (
      <AdvancedMarker position={parkingLocation}>
        <FontAwesomeIcon
          icon={faSquareParking}
          className="text-blue-700 text-2xl"
        ></FontAwesomeIcon>
      </AdvancedMarker>
    );
  }

  return <></>;
};

export default ParkingMarker;
