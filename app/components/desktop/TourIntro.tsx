import { useContext, useEffect, useState } from "react";
import { ClientOnly } from "remix-utils/client-only";
import { TourContext } from "~/contexts/tourContext";
import Gallery from "../shared/Gallery";
import { getTourMedium } from "~/data";
import TourSiteContext from "~/contexts/tourSiteContext";
import type { TMedia } from "~/types/TMedia";

const TourIntro = () => {
  const { tour, stops } = useContext(TourContext);
  const { tenant } = useContext(TourSiteContext);
  const [media, setMedia] = useState<TMedia[] | undefined>();

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
          {media && <ClientOnly>{() => <Gallery media={media} />}</ClientOnly>}
        </div>
        <h2 className="md:hidden text-3xl mb-4">{tour.attributes.title}</h2>

        <div
          className="relative md:px-6 text-black/80 leading-relaxed tracking-wide md:leading-none"
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
