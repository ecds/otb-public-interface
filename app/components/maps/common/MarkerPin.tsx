import { faCircle, faLocationPin } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const MarkerPin = () => (
  <>
    <FontAwesomeIcon
      icon={faLocationPin}
      style={{
        color: "#d32f2f",
        width: "32px",
        height: "32px",
        cursor: "pointer",
        filter: "drop-shadow(2px 4px 6px rgba(0, 0, 0, 0.4))",
      }}
    />
    <span className={`fa-stack-1x fa-inverse text-center`}>
      <FontAwesomeIcon
        icon={faCircle}
        className="text-[0.5rem] text-white/75"
      />
    </span>
  </>
);

export default MarkerPin;
