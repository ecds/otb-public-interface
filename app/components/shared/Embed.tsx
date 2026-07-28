import { usePreferences } from "~/hooks";
import type { TTourMedium } from "~/types";

interface Props {
  medium: TTourMedium;
}

const Embed = ({ medium }: Props) => {
  const { thirdPartyEmbeds, addPreference } = usePreferences();

  if (!thirdPartyEmbeds) {
    return (
      <>
        <div
          className={`h-64 w-full md:h-[33vh] m-auto bg-cover bg-no-repeat bg-center blur-sm brightness-50 opacity-75`}
          style={{ backgroundImage: `url(${medium.files.tablet})` }}
        ></div>
        <div className="absolute text-white m-auto flex flex-col bg-black/35 h-full text-center">
          <p className="mt-8 mx-[25%] text-sm md:text-base">
            This content is hosted by a third party. Loading it will connect you
            to their servers and may set cookies.
          </p>
          <button
            className="bg-blue-400 rounded-md w-fit mx-auto p-2 mt-4"
            onClick={() => addPreference("thirdPartyEmbeds")}
          >
            View Embedded Content
          </button>
        </div>
      </>
    );
  }

  if (medium.embed) {
    return (
      <div className="mx-auto mb-6 px-6 pb-[56.25%] relative block w-full">
        <iframe
          className="m-auto absolute top-0 left-0 border-0"
          width="100%"
          height="100%"
          title={medium.files.desktop}
          src={medium.embed}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; xr-spatial-tracking"
          allowFullScreen
        ></iframe>
      </div>
    );
  }

  return <></>;
};

export default Embed;
