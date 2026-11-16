import { useContext } from "react";
import ClientOnly from "~/components/ClientOnly";
import TourGoogleMap from "~/components/maps/google/TourMap.client";
import TourMap from "~/components/maps/maplibre/TourMap";
import { TourContext } from "~/contexts/TourContext";
import { usePreferences } from "~/hooks";
import { pageTitle } from "~/utils/pageTitle";
import type { MetaFunction } from "react-router";
import type { TTour } from "~/types";

export const meta: MetaFunction = ({ matches }) => {
  const data = matches.find((m) => m.id === "routes/tour")?.loaderData as
    | { tour?: TTour }
    | undefined;
  return [{ title: pageTitle("Map", data?.tour?.title) }];
};

const TourMapRoute = () => {
  const { tour } = useContext(TourContext);
  const { gMaps } = usePreferences();

  if (gMaps && tour?.use_directions) {
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
