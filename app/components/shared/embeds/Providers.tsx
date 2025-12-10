import type { TTourMedium } from "~/types/TTour";

interface Props {
  medium: TTourMedium;
}

export const YouTube = ({ medium }: Props) => {
  if (medium?.embed) {
    return (
      <iframe
        className="m-auto absolute top-0 left-0"
        width="100%"
        height="100%"
        title={medium.files.desktop}
        src={medium.embed}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    );
  }

  return null;
};

export const Vimeo = ({ medium }: Props) => {
  if (medium?.embed) {
    return (
      <iframe
        title={medium.files.desktop}
        src={medium.embed}
        allow="autoplay; fullscreen"
        allowFullScreen
      ></iframe>
    );
  }
};
