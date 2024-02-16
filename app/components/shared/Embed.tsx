import type { TMedia } from "~/types/TMedia";
import YouTube from "./embeds/YouTube";

interface Props {
  medium: TMedia;
}

const IFrame = ({ medium }: Props) => {
  switch (medium.attributes.provider) {
    case "youtube":
      return <YouTube medium={medium} />;
    default:
      return null;
  }
};

const Embed = ({ medium }: Props) => {
  return (
    <div className="aspect-w-16 aspect-h-9 mx-auto mb-6 px-6">
      <IFrame medium={medium} />
    </div>
  );
};

export default Embed;
