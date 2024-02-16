import type { TMedia } from "~/types/TMedia";

interface Props {
  medium: TMedia;
}

const YouTube = ({ medium }: Props) => {
  if (medium?.attributes.embed) {
    return (
      <iframe
        className="m-auto"
        title={medium.id}
        src={medium.attributes.embed}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    );
  }

  return null;
};

export default YouTube;
