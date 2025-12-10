import type { TTourMedium } from "~/types/TTour";
// import { YouTube, Vimeo } from "./embeds/Providers";

interface Props {
  medium: TTourMedium;
}

// const IFrame = ({ medium }: Props) => {
//   switch (medium.provider) {
//     case "youtube":
//       return <YouTube medium={medium} />;
//     case "vimeo":
//       return <Vimeo medium={medium} />;
//     default:
//       return null;
//   }
// };

const Embed = ({ medium }: Props) => {
  if (medium.embed) {
    return (
      <div className="mx-auto mb-6 px-6 pb-[56.25%] relative block w-full">
        <iframe
          className="m-auto absolute top-0 left-0"
          width="100%"
          height="100%"
          title={medium.files.desktop}
          src={medium.embed}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
    );
  }

  return <></>;
};

export default Embed;
