import { Suspense, useState } from "react";
import { redirect } from "react-router";
import { Await, useLoaderData, Outlet } from "react-router";
import Navbar from "~/components/shared/Navbar";
import StopList from "~/components/desktop/StopList";
import TourMap from "~/components/desktop/TourMap.client";
import MobileTourInterface from "~/components/mobile/MobileTourInterface";
import { getTour } from "~/data";
import FlatPage from "~/components/shared/FlatPage";
import ClientOnly from "~/components/ClientOnly";
import { TourContext } from "~/contexts/tourContext";
import TourIntro from "~/components/desktop/TourIntro";
import TourFlatPages from "~/components/desktop/TourFlatPages";
import FlatPageLinks from "~/components/desktop/FlatPageLinks";
import { useDeviceContext } from "~/hooks";
import type { TStop } from "~/types/TStop";
import type { LoaderProps } from "~/types/TLoaderContext";
import type { TTourFlatPage } from "~/types/TTourFlatPage";

export const loader = async ({ context, params }: LoaderProps) => {
  const { tenant, request } = context;
  if (!tenant) {
    throw redirect(`${request.protocol}://${process.env.HOST}`);
  }
  const { tour } = await getTour(tenant, params.tour);
  return { tour };
};

export default function Tour() {
  const { tour } = useLoaderData<typeof loader>();
  const { isMobile, isDesktop } = useDeviceContext();
  const [stops, setStops] = useState<TStop[] | undefined>(undefined);
  const [flatPages, setFlatPages] = useState<TTourFlatPage[] | undefined>(undefined);
  const [currentFlatPage, setCurrentFlatPage] = useState<TTourFlatPage | string | undefined>(undefined);
  const [currentStop, setCurrentStop] = useState<TStop | undefined>(undefined);

  return (
    <TourContext.Provider
      value={{
        tour,
        stops,
        setStops,
        currentStop,
        setCurrentStop,
        flatPages,
        setFlatPages,
        currentFlatPage,
        setCurrentFlatPage,
      }}
    >
      <Suspense fallback={<div>Loading tour...</div>}>
        <Await resolve={tour}>
          {/* Show loading state while detecting device */}
          {isMobile === undefined ? (
            <div className="h-screen flex items-center justify-center bg-gray-100">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
                <p>Loading...</p>
              </div>
            </div>
          ) : isMobile ? (
            <>
              {/* Mobile Interface with navigation */}
              <MobileTourInterface tour={tour} stops={stops} />
              {/* Mobile Outlet for nested routes */}
              <div className="hidden">
                <Outlet />
              </div>
            </>
          ) : (
            <>
              <Navbar>
                <FlatPageLinks />
              </Navbar>
              
              <div className="hidden md:block">
                <div className="grid grid-cols-2 grid-rows-1 h-[calc(100vh-4rem)] grid-flow-row auto-rows-max">
                  <StopList className="mt-24 text-black/80 leading-6">
                    <TourIntro />
                  </StopList>
                  <div className="fixed right-0 w-1/2 h-full mt-16">
                    <ClientOnly>
                      <TourMap tour={tour} stops={stops} />
                    </ClientOnly>
                  </div>
                  <TourFlatPages />
                  <FlatPage flatPage="about" />
                </div>
              </div>
              
              {/* Desktop Outlet for nested routes */}
              <Outlet />
            </>
          )}
        </Await>
      </Suspense>
    </TourContext.Provider>
  );
}