import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlay } from "@fortawesome/free-solid-svg-icons";
import MediumModal from "./MediumModal";
import type { TMedia } from "~/types/TMedia";

interface Props {
  medium: TMedia;
}

const Medium = ({ medium }: Props) => {
  const [showModal, setShowModal] = useState<boolean>(false);

  return (
    <MediumModal
      medium={medium}
      showModal={showModal}
      setShowModal={setShowModal}
    >
      <figure className="flex flex-col justify-center h-full">
        <div
          role="button"
          onClick={() => setShowModal(true)}
          onKeyDown={({ key }: { key: string }) => {
            if (key === "Enter") setShowModal(true);
          }}
          tabIndex={0}
        >
          <div className="relative">
            <img
              className="max-h-96 m-auto"
              src={medium.attributes.files.desktop}
              alt={medium.attributes.caption ?? ""}
            />
            {medium.attributes.video && (
              <div className="absolute left-[calc(50%-3rem)] top-[calc(50%-3rem)] text-center text-[6rem] text-black bg-white/75 rounded-full">
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
