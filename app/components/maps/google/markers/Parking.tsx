import { faSquare, faSquareParking } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AdvancedMarker } from "@vis.gl/react-google-maps";
import { useContext } from "react";
import { StopMapContext } from "~/contexts/StopMapContext";

const ParkingMarker = () => {
  const { parkingLocation, travelMode } = useContext(StopMapContext);

  if (parkingLocation && travelMode.title === "DRIVING") {
    return (
      <AdvancedMarker position={parkingLocation}>
        <span className="cursor-pointer fa-layers">
          <FontAwesomeIcon
            icon={faSquare}
            className="text-white"
            style={{ width: "32px", height: "32px" }}
          />
          <FontAwesomeIcon
            icon={faSquareParking}
            className="text-blue-600"
            style={{ width: "32px", height: "32px" }}
          />
        </span>
      </AdvancedMarker>
    );
  }

  return <></>;
};

export default ParkingMarker;
