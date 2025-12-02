import { Suspense, useContext, useEffect, useRef, useState } from "react";
import { Await, useLoaderData, Outlet, redirect } from "react-router";
import Navbar from "~/components/shared/Navbar";
import StopList from "~/components/desktop/StopList";
import TourMap from "~/components/desktop/TourMap.client";
import { getTour, getTourStops } from "~/data";
import FlatPage from "~/components/shared/FlatPage";
import ClientOnly from "~/components/ClientOnly";
import TourFlatPages from "~/components/desktop/TourFlatPages";
import { useDeviceContext } from "~/hooks/deviceContext";
import { themes, travelModes } from "~/mappings";
import MobileNav from "~/components/mobile/Nav";
import TourSiteContext from "~/contexts/tourSiteContext";
import { TourContext } from "~/contexts/TourContext";
import MainContent from "~/components/shared/MainContent";
import PermissionsModal from "~/components/mobile/PermissionsModal";
import Permissions from "~/components/mobile/Permissions";
import type { TStop } from "~/types/TStop";
import type { LoaderProps } from "~/types/TLoaderContext";
import type { TTourFlatPage } from "~/types/TTourFlatPage";
import type { TTravelMode } from "~/types/TTravelMode";

export const loader = async ({ context, params }: LoaderProps) => {
  const { tenant, request } = context;

  if (!tenant) {
    throw redirect(`${request.protocol}://${process.env.HOST}`);
  }
  const { tour } = await getTour(tenant, params.tour);
  const stopParam = params.stop;
  const themeId = tour.relationships.theme.data.id;
  const theme = themes.find((t) => t.id === themeId)?.title || "default";
  return { tour, theme, stopParam };
};

export default function Tour() {
  const { tour, theme, stopParam } = useLoaderData<typeof loader>();
  const { tenant } = useContext(TourSiteContext);
  const { isMobile, isDesktop } = useDeviceContext();
  const [stops, setStops] = useState<TStop[] | undefined>(undefined);
  const [flatPages, setFlatPages] = useState<TTourFlatPage[] | undefined>(
    undefined
  );
  const [currentFlatPage, setCurrentFlatPage] = useState<
    TTourFlatPage | string | undefined
  >(undefined);
  const [currentStop, setCurrentStop] = useState<TStop | undefined>(undefined);
  const [showMenu, setShowMenu] = useState<boolean>(false);
  const stopsRef = useRef<boolean>(false);
  const modes = tour.relationships.modes.data.map((m) =>
    travelModes.find((tm) => tm.id == m.id)
  );
  const defaultMode: TTravelMode =
    modes.find((m) => m?.id == tour.relationships.mode.data.id) ||
    travelModes[1];

  useEffect(() => {
    const fetchStops = async () => {
      const tourStops = await getTourStops({ tenant, tour });
      setStops(tourStops);
      stopsRef.current = true;
    };

    if (tenant && tour && !stopsRef.current) fetchStops();
  }, [tenant, tour]);

  useEffect(() => {
    if (stopParam && stops) {
      setCurrentStop(stops.find((stop) => stop.attributes.slug == stopParam));
    }

    if (!stopParam) setCurrentStop(undefined);
  }, [stops, stopParam, isDesktop]);

  useEffect(() => {
    if (currentStop && isDesktop) {
      document
        .getElementById(currentStop.attributes.slug)
        ?.scrollIntoView({ behavior: "instant" });
    }
  }, [isDesktop, currentStop]);

  return (
    <TourContext.Provider
      value={{
        currentFlatPage,
        currentStop,
        defaultMode,
        flatPages,
        modes,
        setCurrentFlatPage,
        setCurrentStop,
        setFlatPages,
        setShowMenu,
        setStops,
        showMenu,
        stops,
        theme,
        tour,
      }}
    >
      <Permissions>
        <Navbar />
        <Suspense fallback={<div>Loading tour...</div>}>
          <Await resolve={tour}>
            {isDesktop && (
              <div className="grid grid-cols-2 grid-rows-1 h-[calc(100vh-4rem)] grid-flow-row auto-rows-max">
                <StopList className="text-black/80 leading-6">
                  <MainContent content={tour} />
                </StopList>
                <div className="fixed right-0 w-1/2 h-full mt-16 pb-16">
                  <ClientOnly>
                    <TourMap tour={tour} stops={stops} />
                  </ClientOnly>
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
      </Permissions>
    </TourContext.Provider>
  );
}
