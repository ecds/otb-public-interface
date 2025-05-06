import { Suspense, useState } from "react";
import { Await, useLoaderData, Outlet, redirect } from "react-router";
import Navbar from "~/components/shared/Navbar";
import StopList from "~/components/desktop/StopList";
import TourMap from "~/components/desktop/TourMap.client";
import { getTour } from "~/data";
import FlatPage from "~/components/shared/FlatPage";
import ClientOnly from "~/components/ClientOnly";
import { TourContext } from "~/contexts/tourContext";
import TourIntro from "~/components/desktop/TourIntro";
import TourFlatPages from "~/components/desktop/TourFlatPages";
import FlatPageLinks from "~/components/desktop/FlatPageLinks";
import type { TStop } from "~/types/TStop";
import type { LoaderFunctionArgs } from "react-router";
import type { TTourFlatPage } from "~/types/TTourFlatPage";

export const loader = async ({ context, params }: LoaderFunctionArgs) => {
  const { tenant, request } = context;
  if (!tenant) {
    throw redirect(`${request.protocol}://${process.env.HOST}`);
  }

  if (!params.tour) {
    throw new Response(null, {
      status: 404,
      statusText: "Not found",
    });
  }

  const { tour } = await getTour(tenant, params.tour);
  return { tour };
};

export default function Tour() {
  const { tour } = useLoaderData<typeof loader>();
  const [stops, setStops] = useState<TStop[] | undefined>(undefined);
  const [flatPages, setFlatPages] = useState<TTourFlatPage[] | undefined>();
  const [currentFlatPage, setCurrentFlatPage] = useState<
    TTourFlatPage | string | undefined
  >(undefined);
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
      <Suspense fallback={<div>waiting...blah</div>}>
        <Await resolve={tour}>
          <Navbar>
            <FlatPageLinks />
          </Navbar>
          {/* Desktop */}
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
            <Outlet />
          </div>
          {/* Mobile */}
          <div className="block md:hidden">
            <TourIntro />
          </div>
        </Await>
      </Suspense>
    </TourContext.Provider>
  );
}

// existing code
