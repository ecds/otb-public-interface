import { useContext } from "react";
import TourMenu from "~/components/mobile/TourMenu";
import { TourContext } from "~/contexts/TourContext";

const MobileNavbar = () => {
  const { tour } = useContext(TourContext);
  return (
    <div
      className={`bg-${
        tour?.theme.title ?? "default"
      }-primary text-white p-3 flex items-center justify-between`}
    >
      <TourMenu />
      <h1 className="text-sm font-medium truncate mx-2">{tour?.title}</h1>
      <div className="w-6" />
    </div>
  );
};

export default MobileNavbar;
