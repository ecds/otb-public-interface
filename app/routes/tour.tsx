import { Suspense, useEffect, useRef, useState } from "react";
import { Await, useLoaderData, Outlet, redirect } from "react-router";
import StopList from "~/components/desktop/StopList";
import TourFlatPages from "~/components/desktop/TourFlatPages";
import TourMap from "~/components/desktop/TourMap";
import ConsentSheet from "~/components/mobile/ConsentSheet";
import MobileNav from "~/components/mobile/Nav";
import PermissionsModal from "~/components/mobile/PermissionsModal";
import FlatPage from "~/components/shared/FlatPage";
import MainContent from "~/components/shared/MainContent";
import Navbar from "~/components/shared/Navbar";
import { hasSetPreferences } from "~/utils/cookies";
import { requestContext, tenantContext } from "~/context";
import { TourContext } from "~/contexts/TourContext";
import { getTour, isSignedIn } from "~/data";
import { useDeviceContext } from "~/hooks/deviceContext";
import { baseStyle, blank, hybrid, satellite } from "~/map_styles";
import type { StyleSpecification } from "maplibre-gl";
import type {
  ClientLoaderFunctionArgs,
  LoaderFunctionArgs,
} from "react-router";
import type { TTourStop, TTourFlatPage } from "~/types";

export const loader = async ({
  context,
  params,
}: LoaderFunctionArgs & { params: { tour: string; stop?: string } }) => {
  const tenant = context.get(tenantContext);
  const request = context.get(requestContext);

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
  const { tour_set, tour, stopParam } = useLoaderData<typeof loader>();
  const { isMobile, isDesktop } = useDeviceContext();
  const [currentFlatPage, setCurrentFlatPage] = useState<
    TTourFlatPage | string | undefined
  >(undefined);
  const [currentStop, setCurrentStop] = useState<TTourStop | undefined>(
    undefined,
  );
  const [showMenu, setShowMenu] = useState<boolean>(false);
  const [mapStyle, setMapStyle] = useState<StyleSpecification>(baseStyle);
  const [showPermissionsModal, setShowPermissionsModal] =
    useState<boolean>(false);
  const [showConsentSheet, setShowConsentSheet] = useState<boolean>(false);
  const stopParamRef = useRef<string | undefined>(stopParam);

  useEffect(() => {
    if (isMobile && !hasSetPreferences()) {
      setShowConsentSheet(true);
    }
  }, [isMobile]);

  useEffect(() => {
    if (!stopParamRef.current || !tour) return;
    setCurrentStop(
      tour.stops.find((stop: TTourStop) =>
        stop.slugs.includes(stopParamRef.current ?? ""),
      ),
    );
  }, [stopParam, tour]);

  useEffect(() => {
    if (currentStop && stopParamRef.current && isDesktop) {
      // This for when a stop is requested on the initial load on desktop.
      // We have to wait for the stop elements to be in the DOM.
      const observer = new MutationObserver(() => {
        if (!stopParamRef.current) return;

        const element = document.getElementById(stopParamRef.current);

        if (element) {
          element.scrollIntoView();
          stopParamRef.current = undefined;

          observer.disconnect();
        }
      });

      observer.observe(document.body, { childList: true, subtree: true });
      return () => {
        observer.disconnect();
        stopParamRef.current = undefined;
      };
    }
  }, [currentStop, isDesktop]);

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
                  <ConsentSheet
                    open={showConsentSheet}
                    onDone={() => setShowConsentSheet(false)}
                    onManage={() => {
                      setShowConsentSheet(false);
                      setShowPermissionsModal(true);
                    }}
                  />
                  <PermissionsModal />
                  <TourFlatPages />
                  <FlatPage flatPage="about" />
                </>
              )}
            </Await>
          </Suspense>
        </>
      </TourContext.Provider>
    );
  }

  return <></>;
}
