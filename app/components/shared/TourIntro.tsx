import { useContext, useEffect, useState } from "react";
import ClientOnly from "~/components/ClientOnly";
import { TourContext } from "~/contexts/TourContext";
import Gallery from "./Gallery";
import { getTourMedium } from "~/data";
import TourSiteContext from "~/contexts/tourSiteContext";
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

  if (tour) {
    return (
      <div className="stop mt-16 md:mt-0 px-0" id={tour.attributes.slug}>
        <div className="">
          {media && (
            <ClientOnly>
              <Gallery media={media} />
            </ClientOnly>
          )}
        </div>
        <div className="px-6 mb-20 md:mb-0">
          <h2 className="md:hidden text-3xl mb-4">{tour.attributes.title}</h2>

          <div
            className="relative"
            dangerouslySetInnerHTML={{
              __html: tour.attributes.description,
            }}
          />
        </div>
      </div>
    );
  }

  return null;
};

export default TourIntro;
