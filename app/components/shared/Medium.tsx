import { useContext, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlay } from "@fortawesome/free-solid-svg-icons";
import { ScrollamaContext } from "~/contexts/scrollamaContext";
import type { TMedium } from "~/types/TMedia";

interface Props {
  medium: TMedium;
  className?: string;
  onClick?: (index: number) => void;
  index?: number;
}

const Medium = ({ medium, className, onClick, index = 0 }: Props) => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const { resize } = useContext(ScrollamaContext);
  const [loaded, setLoaded] = useState<boolean>(false);

  useEffect(() => {
    if (resize && loaded) resize();
  }, [resize, loaded]);

  const handleClick = () => {
    if (onClick) onClick(index);
  };

  return (
    <div className="relative flex items-baseline h-64">
      <img
        className={`max-h-64 md:max-h-64 m-auto cursor-pointer transition-opacity duration-1000 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
        role="button"
        srcSet={medium.attributes.files.desktop}
        alt={medium.attributes.caption ?? ""}
        onLoad={() => setLoaded(true)}
        onClick={handleClick}
      />
      {medium.attributes.video && (
        <div className="absolute left-1/2 -translate-x-12 top-1/2 -translate-y-12 text-center text-[6rem] text-black bg-white/75 rounded-full mx-auto flex">
          <FontAwesomeIcon className="" icon={faCirclePlay} />
        </div>
      )}
    </div>
  );
};

export default Medium;
