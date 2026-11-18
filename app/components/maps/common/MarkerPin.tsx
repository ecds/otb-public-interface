import { faCircle, faLocationPin } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const MarkerPin = ({
  color,
  position,
  isCurrent = false,
}: {
  color?: string;
  position?: number;
  isCurrent?: boolean;
}) => (
  <>
    <FontAwesomeIcon
      icon={faLocationPin}
      style={{
        color: color ?? "#d32f2f",
        width: isCurrent ? "48px" : "32px",
        height: isCurrent ? "48px" : "32px",
        cursor: "pointer",
        filter: "drop-shadow(2px 4px 6px rgba(0, 0, 0, 0.4))",
      }}
    />
    <span
      className={`fa-stack-1x fa-inverse text-center ${
        isCurrent ? "text-xl w-12" : "text-base w-8"
      }`}
    >
      {!position || position === 0 ? (
        <FontAwesomeIcon icon={faCircle} className="text-xs text-black/35" />
      ) : (
        <>{position}</>
      )}
    </span>
  </>
);

export default MarkerPin;
