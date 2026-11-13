import L from "leaflet";
import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";
import type { Dispatch, ReactNode, SetStateAction } from "react";

interface Props {
  setMap: Dispatch<SetStateAction<L.Map | undefined>>;
  children: ReactNode;
}

const AllToursLeaflet = ({ setMap, children }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !containerRef.current) return;

    const _map = L.map(containerRef.current).setView(
      [32.6620411, -83.4375901],
      6,
    );

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(_map);

    setMap(_map);

    return () => {
      _map.remove();
      setMap(undefined);
    };
  }, [setMap]);

  return (
    <div ref={containerRef} className="w-full max-w-screen h-[50vh] mt-16">
      {children}
    </div>
  );
};

export default AllToursLeaflet;
