import { faCirclePlay } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { useDeviceContext } from "~/hooks/deviceContext";
import type { TTourMedium } from "~/types";

interface Props {
  medium: TTourMedium;
  onClick?: (index: number) => void;
  index?: number;
}

// Tracks whether a (CSS background) image has finished loading. Errors count
// as "done" so a broken image doesn't leave the placeholder pulsing forever.
const useImageLoaded = (src: string | undefined) => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(false);
    if (!src) return;

    const img = new Image();
    img.onload = () => setLoaded(true);
    img.onerror = () => setLoaded(true);
    img.src = src;
    if (img.complete) setLoaded(true);

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src]);

  return loaded;
};

const Medium = ({ medium, onClick, index = 0 }: Props) => {
  const { isMobile } = useDeviceContext();
  const src = isMobile ? medium.files.mobile : medium.files.desktop;
  const loaded = useImageLoaded(src);
  // The inline data URI shows instantly; the lqip URL needs its own request.
  const placeholder = medium.lqip_data ?? medium.files.lqip;

  const handleClick = () => {
    if (onClick) onClick(index);
  };

  return (
    <div
      className="relative flex items-baseline h-64 md:h-[45vh] overflow-hidden"
      aria-busy={!loaded}
    >
      {!loaded && (
        <div
          data-testid="medium-placeholder"
          aria-hidden="true"
          className="absolute inset-0 bg-gray-200 motion-safe:animate-pulse"
        >
          {placeholder && (
            <div
              className="absolute inset-0 bg-cover bg-center blur-xl scale-110 opacity-60"
              style={{ backgroundImage: `url(${placeholder})` }}
            />
          )}
        </div>
      )}
      <button
        className={`relative m-auto h-full w-full bg-contain bg-center bg-no-repeat flex flex-col-reverse cursor-pointer motion-safe:transition-opacity motion-safe:duration-500 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
        style={{ backgroundImage: `url(${src})` }}
        onClick={handleClick}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleClick();
          }
        }}
      >
        <img src={medium.files.lqip} alt={medium.caption} className="sr-only" />
        {medium.title && medium.title !== medium.filename && (
          <div className="w-full bg-black/60 text-white py-1 rounded-md">
            {medium.title}
          </div>
        )}
      </button>
      {medium.video && (
        <div className="absolute left-1/2 -translate-x-12 top-1/2 -translate-y-12 text-center text-[6rem] text-black bg-white/75 rounded-full mx-auto flex pointer-events-none">
          <FontAwesomeIcon className="" icon={faCirclePlay} />
        </div>
      )}
    </div>
  );
};

export default Medium;
