import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router";

const Analytics = ({ id = 4 }: { id: number }) => {
  const location = useLocation();
  const trackerRef = useRef<HTMLImageElement>(null);
  const [key, setKey] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    setKey(location.key);
    trackerRef.current?.setAttribute(
      "src",
      `https://matomo.ecdsdev.org/matomo.php?idsite=${id}&rec=1`,
    );
  }, [location, id]);

  if (process.env.NODE_ENV == "production") {
    return (
      <img
        ref={trackerRef}
        alt=""
        src=""
        className="border-0 height-0"
        id={key}
        referrerPolicy="no-referrer-when-downgrade"
      />
    );
  }
  return null;
};

export default Analytics;
