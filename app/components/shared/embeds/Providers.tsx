import type { TMedium } from "~/types/TMedia";

interface Props {
  medium: TMedium;
}

export const YouTube = ({ medium }: Props) => {
  if (medium?.attributes.embed) {
    return (
      <iframe
        className="m-auto absolute top-0 left-0"
        width="100%"
        height="100%"
        title={medium.id}
        src={medium.attributes.embed}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    );
  }

  return null;
};

export const Vimeo = ({ medium }: Props) => {
  if (medium?.attributes.embed) {
    return (
      <iframe
        title={medium.id}
        src={medium.attributes.embed}
        allow="autoplay; fullscreen"
        allowFullScreen
      ></iframe>
    );
  }
};
