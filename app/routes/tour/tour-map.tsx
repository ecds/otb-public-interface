import { useContext } from "react";
import ClientOnly from "~/components/ClientOnly";
import TourMap from "~/components/desktop/TourMap";
import TourGoogleMap from "~/components/mobile/TourMap.client";
import { TourContext } from "~/contexts/TourContext";
import { sitePreferences } from "~/utils/cookies";

const currentPrefs = sitePreferences();

const TourMapRoute = () => {
  const { tour } = useContext(TourContext);

  if (currentPrefs.includes("gMap") && tour?.use_directions) {
    return (
      <div className="w-screen h-[calc(100vh-8rem)] mt-16">
        <ClientOnly>
          <TourGoogleMap />
        </ClientOnly>
      </div>
    );
  }

  return (
    <div className="w-screen h-[calc(100vh-8rem)] mt-16">
      <TourMap />
    </div>
  );
};

export default TourMapRoute;
