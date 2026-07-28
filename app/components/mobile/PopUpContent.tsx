import { useContext } from "react";
import { useNavigate } from "react-router";
import { TourContext } from "~/contexts/TourContext";
import type { TTourStop } from "~/types";

interface Props {
  stop: TTourStop;
}

const PopUpContent = ({ stop }: Props) => {
  const navigate = useNavigate();
  const { tour, setCurrentStop } = useContext(TourContext);

  const goToStop = () => {
    setCurrentStop(stop);
    navigate(`/${tour?.slug}/${stop.slug}`);
  };

  return (
    <>
      <h3 className="text-base md:text-lg mb-2">{stop.title}</h3>
      <button
        role="link"
        className="text-blue-500 visited:text-purple-800 underline"
        onClick={goToStop}
      >
        Go To Stop
      </button>
    </>
  );
};

export default PopUpContent;
