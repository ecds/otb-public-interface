import { faCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AdvancedMarker } from "@vis.gl/react-google-maps";
import { useContext } from "react";
import PermissionsContext from "~/contexts/PermissionsContext";
import { StopMapContext } from "~/contexts/StopMapContext";

const DeviceLocationMarker = () => {
  const { deviceLocation } = useContext(StopMapContext);
  const { locationAllowed } = useContext(PermissionsContext);

  if (deviceLocation && locationAllowed) {
    return (
      <AdvancedMarker position={deviceLocation}>
        <FontAwesomeIcon
          icon={faCircle}
          className="text-blue-700 animate-pulse"
        ></FontAwesomeIcon>
      </AdvancedMarker>
    );
  }

  return <></>;
};

export default DeviceLocationMarker;
