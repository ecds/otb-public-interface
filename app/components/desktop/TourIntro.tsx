import { useContext, useEffect, useState } from "react";
import ClientOnly from "~/components/ClientOnly";
import { TourContext } from "~/contexts/tourContext";
import Gallery from "../shared/Gallery";
import { getTourMedium } from "~/data";
import TourSiteContext from "~/contexts/tourSiteContext";
import TextToSpeechButton from "~/components/shared/TextToSpeechButton";
import type { TMedium } from "~/types/TMedia";

const TourIntro = () => {
  const { tour, stops } = useContext(TourContext);
  const { tenant } = useContext(TourSiteContext);
  const [media, setMedia] = useState<TMedium[] | undefined>();

  useEffect(() => {
    const fetchMedia = async () => {
      if (!tenant || !tour || !tour.relationships.tour_media) return;
      const _media = [];
      for (const medium of tour.relationships.tour_media.data) {
        const mediumData = await getTourMedium(tenant, medium.id);
        _media.push(mediumData);
      }
      setMedia(_media);
    };

    fetchMedia();
  }, [tour, tenant]);

  if (tour && stops) {
    return (
      <div
        className="stop mt-20 md:mt-0 px-2 md:px-0"
        id={tour.attributes.slug}
      >
        <div className="h-64 md:h-96 mx-6">
          {media && (
            <ClientOnly>
              <Gallery media={media} />
            </ClientOnly>
          )}
        </div>
        
        <div className="md:hidden flex items-center justify-between mb-4 px-4">
          <h2 className="text-3xl flex-1">{tour.attributes.title}</h2>
          <TextToSpeechButton 
            text={tour.attributes.description}
            variant="headphones"
            size="lg"
            className="flex-shrink-0 ml-3"
          />
        </div>

        <div
          className="relative md:px-6"
          dangerouslySetInnerHTML={{
            __html: tour.attributes.description,
          }}
        />
      </div>
    );
  }

  return null;
};

export default TourIntro;