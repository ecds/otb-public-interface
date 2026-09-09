import ClientOnly from "~/components/ClientOnly";
import TextToSpeechButton from "~/components/shared/TextToSpeechButton";
import { useDeviceContext } from "~/hooks/deviceContext";
import Gallery from "../shared/ModalGallery";
import type { TTour, TTourStop } from "~/types";

interface Props {
  content: TTourStop | TTour;
}

const MainContent = ({ content }: Props) => {
  const { isDesktop, isMobile } = useDeviceContext();

  return (
    <div key={content.slug} className="mb-12" id={content.slug}>
      <div className="md:relative w-full mt-16 md:mt-0">
        <div className="flex flex-col ">
          {isDesktop && (
            <div
              className={
                "sticky top-14 bg-white z-10 w-full h-fit pt-4 mb-4 drop-shadow-sm px-6 py-2 "
              }
            >
              <h2 className="text-xl md:text-2xl">
                {content.type === "stop" && <>{content.position}: </>}
                {content.title}
              </h2>
            </div>
          )}
          {!content.media && <Gallery />}
          {content.media && (
            <ClientOnly>
              <Gallery media={content.media} />
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
                  {content.type === "stop" && <>{content.position}: </>}
                  {content.title}
                </h2>
              </div>
            </div>
          )}
          <div className="relative px-6 stop mb-24 md:mb-0 box-content flow-root">
            <TextToSpeechButton
              text={content.sanitized_description}
              voiceOverUrl={content.voice_overs?.[0]?.source_url}
            />
            <div
              className="prose mx-auto"
              dangerouslySetInnerHTML={{
                __html: content.description,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainContent;
