import { useContext, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlay } from "@fortawesome/free-solid-svg-icons";
import MediumModal from "./MediumModal";
import type { TMedia } from "~/types/TMedia";
import { ScrollamaContext } from "~/contexts/scrollamaContext";

interface Props {
  medium: TMedia;
}

const Medium = ({ medium }: Props) => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const { resize } = useContext(ScrollamaContext);
  const [loaded, setLoaded] = useState<boolean>(false);

  useEffect(() => {
    if (resize && loaded) resize();
  }, [resize, loaded]);

  return (
    <MediumModal
      medium={medium}
      showModal={showModal}
      setShowModal={setShowModal}
    >
      <figure className="w-full">
        <div
          role="button"
          onClick={() => setShowModal(true)}
          onKeyDown={({ key }: { key: string }) => {
            if (key === "Enter") setShowModal(true);
          }}
          tabIndex={0}
        >
          <div className="relative flex justify-center">
            <picture className="">
              <source srcSet={medium.attributes.files.desktop} />
              <img
                className={`max-h-64 md:max-h-80 m-auto ${
                  loaded ? "opacity-100" : "opacity-0"
                }`}
                srcSet={medium.attributes.files.desktop}
                alt={medium.attributes.caption ?? ""}
                onLoad={() => setLoaded(true)}
              />
            </picture>
            {medium.attributes.title && (
              <figcaption className="absolute bottom-0 bg-black/60 w-3/4 my-0 mx-4 text-center text-white text-ellipsis overflow-hidden h-min max-h-16 truncate p-2">
                {medium.attributes.title}
              </figcaption>
            )}
            {medium.attributes.video && (
              <div className="absolute left-[calc(50%-3rem)] top-[calc(50%-3rem)] text-center text-[6rem] text-black bg-white/75 rounded-full mx-auto flex">
                <FontAwesomeIcon className="" icon={faCirclePlay} />
              </div>
            )}
          </div>
        </div>
      </figure>
    </MediumModal>
  );
};

export default Medium;
