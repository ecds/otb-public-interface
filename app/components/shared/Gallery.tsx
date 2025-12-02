import { Carousel } from "nuka-carousel";
import Medium from "./Medium";
import ImagePlaceholder from "./ImagePlaceholder";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { useDeviceContext } from "~/hooks/deviceContext";
import type { TMedium } from "~/types/TMedia";

interface Props {
  media?: TMedium[];
  className?: string;
}

const Gallery = ({ media, className }: Props) => {
  const { isDesktop } = useDeviceContext();

  if (media) {
    return (
      <Carousel
        className="mx-auto w-screen md:w-[50vw]"
        showArrows={isDesktop}
        showDots
        scrollDistance="slide"
        wrapMode="wrap"
      >
        {media.map((medium) => {
          return (
            <Medium
              medium={medium}
              className="min-w-screen md:min-w-[50vw]"
              key={medium.id}
            />
          );
        })}
      </Carousel>
    );
  }

  return (
    <Carousel>
      <div className="w-screen md:w-[50ww] h-64 m-auto flex justify-center items-center">
        <ImagePlaceholder />
        <FontAwesomeIcon
          icon={faSpinner}
          className="absolute text-8xl motion-safe:animate-spin opacity-65"
          style={{ animationDuration: "4s" }}
        />
      </div>
    </Carousel>
  );
};

export default Gallery;
