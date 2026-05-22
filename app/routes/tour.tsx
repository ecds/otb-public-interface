import { Suspense, useEffect, useState } from "react";
import { Await, useLoaderData, Outlet, redirect } from "react-router";
import Navbar from "~/components/shared/Navbar";
import StopList from "~/components/desktop/StopList";
import { getTour, isSignedIn } from "~/data";
import FlatPage from "~/components/shared/FlatPage";
import TourFlatPages from "~/components/desktop/TourFlatPages";
import { useDeviceContext } from "~/hooks/deviceContext";
import MobileNav from "~/components/mobile/Nav";
import { TourContext } from "~/contexts/TourContext";
import MainContent from "~/components/shared/MainContent";
import PermissionsModal from "~/components/mobile/PermissionsModal";
import TourMap from "~/components/desktop/TourMap";
import { PermissionsContext } from "~/contexts/PermissionsContext";
import { sitePreferences } from "~/utils/cookies";
import { baseStyle, blank, hybrid, satellite } from "~/map_styles";
import type { ClientLoaderFunctionArgs } from "react-router";
import type { TTourStop, TTourFlatPage } from "~/types/TTour";
import type { LoaderProps } from "~/types/TLoaderContext";
import type { StyleSpecification } from "maplibre-gl";

const storedPrefs = sitePreferences();

export const loader = async ({ context, params }: LoaderProps) => {
  const { tenant, request } = context;

  if (!tenant) {
    throw redirect(`${request.protocol}://${process.env.HOST}`);
  }

  const tourParam = params.tour;
  const stopParam = params.stop;

  const { tour, tour_set } = await getTour(tenant, params.tour);

  return { tenant, tour_set, tour, tourParam, stopParam };
};

export async function clientLoader({ serverLoader }: ClientLoaderFunctionArgs) {
  const serverData = await serverLoader<typeof loader>();

  const signedIn = await isSignedIn();

  if (signedIn) {
    const { tour_set, tour } = await getTour(
      serverData.tenant,
      serverData.tourParam,
    );
    return { ...serverData, tour_set, tour };
  } else {
    return { ...serverData };
  }

  throw new Response(null, { status: 404, statusText: "Not found" });
}

clientLoader.hydrate = true as const;

export default function Tour() {
  const { tour_set, tour } = useLoaderData<typeof loader>();
  const { isMobile, isDesktop } = useDeviceContext();
  const [currentFlatPage, setCurrentFlatPage] = useState<
    TTourFlatPage | string | undefined
  >(undefined);
  const [currentStop, setCurrentStop] = useState<TTourStop | undefined>(
    undefined,
  );
  const [analyticsAllowed, setAnalyticsAllowed] = useState<boolean>(
    storedPrefs.includes("analyticsAllowed"),
  );
  const [gMaps, setGMaps] = useState<boolean>(storedPrefs.includes("gMaps"));
  const [locationAllowed, setLocationAllowed] = useState<boolean>(
    storedPrefs.includes("locationAllowed"),
  );
  const [realtimeLocation, setRealtimeLocation] = useState<boolean>(
    storedPrefs.includes("realtimeLocation"),
  );
  const [functional, setFunctional] = useState<boolean>(true);
  const [showMenu, setShowMenu] = useState<boolean>(false);
  const [mapStyle, setMapStyle] = useState<StyleSpecification>(baseStyle);
  const [showPermissionsModal, setShowPermissionsModal] =
    useState<boolean>(false);

  useEffect(() => {
    if (!tour) return;
    switch (tour.map_type) {
      case "satellite":
        setMapStyle(satellite);
        break;
      case "hybrid":
        setMapStyle(hybrid);
        break;
      default:
        setMapStyle(baseStyle);
        break;
    }

    if (tour.blank_map) {
      setMapStyle(blank);
    }
  }, [tour]);

  if (tour) {
    return (
      <TourContext.Provider
        value={{
          currentFlatPage,
          currentStop,
          setCurrentFlatPage,
          setCurrentStop,
          setShowMenu,
          showMenu,
          tour,
          mapStyle,
        }}
      >
        <PermissionsContext.Provider
          value={{
            analyticsAllowed,
            setAnalyticsAllowed,
            gMaps,
            setGMaps,
            locationAllowed,
            setLocationAllowed,
            realtimeLocation,
            setRealtimeLocation,
            functional,
            setFunctional,

            showPermissionsModal,
            setShowPermissionsModal,
          }}
        >
          <>
            <Navbar tour_set={tour_set} />
            <Suspense fallback={<div>Loading tour...</div>}>
              <Await resolve={tour}>
                {isDesktop && tour && tour.stops && (
                  <div className="grid grid-cols-2 grid-rows-1 h-[calc(100vh-16rem)] grid-flow-row auto-rows-max">
                    <StopList
                      className="text-black/80 leading-6"
                      intro={<MainContent content={tour} />}
                    />
                    <div className="fixed right-0 w-1/2 h-full mt-16 pb-16">
                      <TourMap />
                    </div>
                    <TourFlatPages />
                    <FlatPage flatPage="about" />
                  </div>
                )}
                {isMobile && (
                  <>
                    <MobileNav />
                    <Outlet />
                    <PermissionsModal />
                    <TourFlatPages />
                    <FlatPage flatPage="about" />
                  </>
                )}
              </Await>
            </Suspense>
          </>
        </PermissionsContext.Provider>
      </TourContext.Provider>
    );
  }

  return <></>;
}
