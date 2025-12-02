import { useContext } from "react";
import TourMenu from "~/components/mobile/TourMenu";
import { TourContext } from "~/contexts/TourContext";

interface Props {
  tourTitle: string;
}

const MobileNavbar = ({ tourTitle }: Props) => {
  const { tour, theme } = useContext(TourContext);
  return (
    <div
      className={`bg-${theme}-primary text-white p-3 flex items-center justify-between`}
    >
      <TourMenu />
      <h1 className="text-sm font-medium truncate mx-2">
        {tour?.attributes.title}
      </h1>
      <div className="w-6" />
    </div>
  );
};

export default MobileNavbar;
