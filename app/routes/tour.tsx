import { Suspense, useState } from "react";
import { Await, useLoaderData, Outlet, redirect } from "react-router";
import Navbar from "~/components/shared/Navbar";
import StopList from "~/components/desktop/StopList";
import TourMap from "~/components/shared/TourMap.client";
import { getTour, isSignedIn } from "~/data";
import FlatPage from "~/components/shared/FlatPage";
import ClientOnly from "~/components/ClientOnly";
import TourFlatPages from "~/components/desktop/TourFlatPages";
import { useDeviceContext } from "~/hooks/deviceContext";
import MobileNav from "~/components/mobile/Nav";
import { TourContext } from "~/contexts/TourContext";
import MainContent from "~/components/shared/MainContent";
import PermissionsModal from "~/components/mobile/PermissionsModal";
import Permissions from "~/components/mobile/Permissions";
import type { ClientLoaderFunctionArgs } from "react-router";
import type { TTourStop, TTourFlatPage } from "~/types/TTour";
import type { LoaderProps } from "~/types/TLoaderContext";

export const loader = async ({ context, params }: LoaderProps) => {
  const { tenant, request } = context;

  if (!tenant) {
    throw redirect(`${request.protocol}://${process.env.HOST}`);
  }

  const tourParam = params.tour;
  const stopParam = params.stop;

  const { tour } = await getTour(tenant, params.tour);

  return { tenant, tour, tourParam, stopParam };
};

export async function clientLoader({ serverLoader }: ClientLoaderFunctionArgs) {
  const serverData = await serverLoader<typeof loader>();

  if (serverData.tour.stops) return serverData;

  const signedIn = await isSignedIn();

  if (signedIn) {
    const { tour } = await getTour(serverData.tenant, serverData.tourParam);
    return { ...serverData, tour };
  }

  throw new Response(null, { status: 404, statusText: "Not found" });
}

clientLoader.hydrate = true as const;

export default function Tour() {
  const { tour } = useLoaderData<typeof loader>();
  console.log("🚀 ~ Tour ~ tour:", tour);
  const { isMobile, isDesktop } = useDeviceContext();
  const [currentFlatPage, setCurrentFlatPage] = useState<
    TTourFlatPage | string | undefined
  >(undefined);
  const [currentStop, setCurrentStop] = useState<TTourStop | undefined>(
    undefined,
  );
  const [showMenu, setShowMenu] = useState<boolean>(false);

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
      }}
    >
      <Permissions>
        <Navbar />
        <Suspense fallback={<div>Loading tour...</div>}>
          <Await resolve={tour}>
            {isDesktop && tour.stops && (
              <div className="grid grid-cols-2 grid-rows-1 h-[calc(100vh-4rem)] grid-flow-row auto-rows-max">
                <StopList
                  className="text-black/80 leading-6"
                  intro={<MainContent content={tour} />}
                />
                <div className="fixed right-0 w-1/2 h-full mt-16 pb-16">
                  <ClientOnly>
                    <TourMap />
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
