import { faCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AdvancedMarker } from "@vis.gl/react-google-maps";
import { usePreferences } from "~/hooks";
import { useDeviceLocation } from "~/hooks/deviceLocation";

const DeviceLocationMarker = () => {
  const { deviceLocation } = useDeviceLocation();
  const { locationAllowed } = usePreferences();

  if (locationAllowed) {
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
