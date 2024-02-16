import Carousel from "nuka-carousel";
import type { ControlProps } from "nuka-carousel";
import type { TMedia } from "~/types/TMedia";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import Medium from "./Medium";

// const element = <FontAwesomeIcon icon={faCoffee} />

interface Props {
  media: TMedia[];
}

export const leftControls = ({
  previousDisabled,
  previousSlide,
}: ControlProps) => {
  return (
    <div className="text-3xl">
      <button
        aria-label="Navigate to previous figure"
        type="button"
        disabled={previousDisabled}
        onClick={previousSlide}
        className="bg-white/50 h-28 rounded px-2"
      >
        <FontAwesomeIcon icon={faChevronLeft} />
      </button>
    </div>
  );
};

export const rightControls = ({ nextDisabled, nextSlide }: ControlProps) => {
  return (
    <div className="text-3xl">
      <button
        aria-label="Navigate to next figure"
        aria-controls=":r1fd:-slider-frame"
        type="button"
        disabled={nextDisabled}
        onClick={nextSlide}
        className="bg-white/50 h-28 rounded px-2"
      >
        <FontAwesomeIcon icon={faChevronRight} />{" "}
      </button>
    </div>
  );
};

export const noControl = () => {
  return <></>;
};

const Gallery = ({ media }: Props) => {
  return (
    <Carousel
      renderCenterLeftControls={leftControls}
      renderCenterRightControls={rightControls}
      wrapAround
    >
      {media.map((medium) => {
        return <Medium key={medium.id} medium={medium} />;
      })}
    </Carousel>
  );
};

export default Gallery;
