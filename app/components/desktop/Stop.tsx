import { useContext, useEffect, useState } from "react";
import ClientOnly from "~/components/ClientOnly";
import { getStopMedium } from "~/data";
import Gallery from "../shared/Gallery";
import TourSiteContext from "~/contexts/tourSiteContext";
import type { TStop } from "~/types/TStop";
import type { TMedium } from "~/types/TMedia";

interface Props {
  stop: TStop;
}

const Stop = ({ stop }: Props) => {
  const [media, setMedia] = useState<TMedium[] | undefined>();
  const { tenant } = useContext(TourSiteContext);
  useEffect(() => {
    const fetchMedia = async () => {
      if (!tenant || !stop || !stop.relationships.stop_media) return;
      const _media = [];
      for (const medium of stop.relationships.stop_media.data) {
        const mediumData = await getStopMedium(tenant, medium.id);
        _media.push(mediumData);
      }
      setMedia(_media);
    };

    fetchMedia();
  }, [stop, tenant]);

  return (
    <div key={stop.id} className="" id={stop.attributes.slug}>
      <div
        className={
          "sticky top-14 bg-white z-10 w-full h-fit text-2xl pt-4 mb-4 drop-shadow-sm"
        }
      >
        <h2 className="px-6 py-2">
          {stop.attributes.position}: {stop.attributes.title}
        </h2>
      </div>
      <div className="relative px-6 w-full pointer-events-auto">
        {media && (
          <ClientOnly>
            <Gallery media={media} />
          </ClientOnly>
        )}
      </div>
      <div
        className="relative px-6"
        dangerouslySetInnerHTML={{
          __html: stop.attributes.description,
        }}
      />
    </div>
  );
};

export default Stop;
