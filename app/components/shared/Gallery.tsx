import { Carousel } from "nuka-carousel";
import useEmblaCarousel from "embla-carousel-react";
import AutoHeight from "embla-carousel-auto-height";
import Medium from "./Medium";
import ImagePlaceholder from "./ImagePlaceholder";
import { NextButton, PrevButton, usePrevNextButtons } from "./ArrowButtons";
import { DotButton, useDotButton } from "./DotButtons";
import type { TMedium } from "~/types/TMedia";

// const element = <FontAwesomeIcon icon={faCoffee} />

interface Props {
  media?: TMedium[];
}

const Gallery = ({ media }: Props) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [AutoHeight()]);

  const { selectedIndex, scrollSnaps, onDotButtonClick } =
    useDotButton(emblaApi);

  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick,
  } = usePrevNextButtons(emblaApi);
  if (media) {
    return (
      <div className="@container embla">
        <div className="embla__viewport" ref={emblaRef}>
          <div className="embla__container">
            {media.map((medium, index) => (
              <div className="embla__slide" key={medium.id}>
                <div className="embla__slide__number">
                  <Medium medium={medium} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="embla__controls">
          <div className="embla__buttons">
            <PrevButton
              onClick={onPrevButtonClick}
              disabled={prevBtnDisabled}
            />
            <NextButton
              onClick={onNextButtonClick}
              disabled={nextBtnDisabled}
            />
          </div>

          <div className="embla__dots">
            {scrollSnaps.map((_, index) => (
              <DotButton
                key={index}
                onClick={() => onDotButtonClick(index)}
                className={"embla__dot".concat(
                  index === selectedIndex ? " embla__dot--selected" : ""
                )}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <Carousel>
      <ImagePlaceholder />
    </Carousel>
  );
};

export default Gallery;
