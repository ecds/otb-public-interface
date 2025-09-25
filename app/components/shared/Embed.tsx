import type { TMedium } from "~/types/TMedia";
import { YouTube, Vimeo } from "./embeds/Providers";

interface Props {
  medium: TMedium;
}

const IFrame = ({ medium }: Props) => {
  switch (medium.attributes.provider) {
    case "youtube":
      return <YouTube medium={medium} />;
    case "vimeo":
      return <Vimeo medium={medium} />;
    default:
      return null;
  }
};

const Embed = ({ medium }: Props) => {
  if (medium.attributes.embed) {
    return (
      <div className="mx-auto mb-6 px-6 pb-[56.25%] relative block w-full">
        <iframe
          className="m-auto absolute top-0 left-0"
          width="100%"
          height="100%"
          title={medium.id}
          src={medium.attributes.embed}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
    );
  }

  return <></>;
};

export default Embed;
