import { useContext, useEffect, useState } from "react";
import ClientOnly from "~/components/ClientOnly";
import { getStopMedium, getTourMedium } from "~/data";
import Gallery from "./ModalGallery";
import TourSiteContext from "~/contexts/tourSiteContext";
import TextToSpeechButton from "~/components/shared/TextToSpeechButton";
import { useDeviceContext } from "~/hooks/deviceContext";
import type { TTour } from "~/types/TTour";
import type { TStop } from "~/types/TStop";
import type { TMedium } from "~/types/TMedia";

interface Props {
  content: TStop | TTour;
}

const MainContent = ({ content }: Props) => {
  const [media, setMedia] = useState<TMedium[] | undefined>();
  const { tenant } = useContext(TourSiteContext);
  const { isDesktop, isMobile } = useDeviceContext();

  let hasMedia = true;

  switch (content.type) {
    case "stops":
      hasMedia = content.relationships.stop_media.data.length > 0;
      break;
    case "tours":
      hasMedia = content.relationships.tour_media.data.length > 0;
      break;
    default:
      break;
  }

  useEffect(() => {}, []);

  useEffect(() => {
    const fetchMedia = async () => {
      setMedia(undefined);
      if (!tenant || !content) return;
      const mediaData = [];

      switch (content.type) {
        case "tours":
          if (content.relationships.tour_media.data) {
            for (const medium of content.relationships.tour_media.data) {
              const mediumData = await getTourMedium(tenant, medium.id);
              mediaData.push(mediumData);
            }
          }
          break;
        case "stops":
          if (content.relationships.stop_media.data) {
            for (const medium of content.relationships.stop_media.data) {
              const mediumData = await getStopMedium(tenant, medium.id);
              mediaData.push(mediumData);
            }
          }
          break;
        default:
          break;
      }
      setMedia(mediaData);
    };

    fetchMedia();
  }, [content, tenant]);

  return (
    <div key={content.id} className="mb-12" id={content.attributes.slug}>
      <div className="md:relative w-full mt-16 md:mt-0">
        <div className="flex flex-col">
          {isDesktop && (
            <div
              className={
                "sticky top-14 bg-white z-10 w-full h-fit pt-4 mb-4 drop-shadow-sm px-6 py-2 "
              }
            >
              <h2 className="text-xl md:text-2xl">
                {content.type === "stops" && (
                  <>{content.attributes.position}: </>
                )}
                {content.attributes.title}
              </h2>
            </div>
          )}
          {hasMedia && !media && <Gallery />}
          {media && (
            <ClientOnly>
              <Gallery media={media} />
            </ClientOnly>
          )}
          {isMobile && (
            <div
              className={
                "sticky top-14 bg-white z-10 w-full h-fit pt-4 mb-4 drop-shadow-sm"
              }
            >
              <div className="px-6 py-2 flex items-center justify-between">
                <h2 className="text-xl md:text-2xl">
                  {content.type === "stops" && (
                    <>{content.attributes.position}: </>
                  )}
                  {content.attributes.title}
                </h2>
              </div>
            </div>
          )}
          <div className="tracking-wide leading-6 relative px-6 stop mb-24 md:mb-0 box-content flow-root">
            <TextToSpeechButton
              text={content.attributes.sanitized_description}
            />
            <div
              className="otb-content"
              dangerouslySetInnerHTML={{
                __html: content.attributes.description,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainContent;
