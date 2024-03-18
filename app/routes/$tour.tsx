import { useContext } from "react";
import { json, redirect } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import TourSiteContext from "~/contexts/tourSiteContext";
import DesktopNavbar from "~/components/desktop/DesktopNavbar";
import StopList from "~/components/desktop/StopList";
import TourMap from "~/components/desktop/TourMap";
import { getTour } from "~/data";
import FlatPage from "~/components/shared/FlatPage";
import type { TLoaderContext } from "~/types/TLoaderContext";
import type { TTourFlatPage } from "~/types/TTourFlatPage";

interface LoaderProps {
  context: TLoaderContext;
  params: { tour: string };
}

export const loader = async ({ context, params }: LoaderProps) => {
  const { tenant } = context;
  if (!tenant) {
    throw redirect(`http://${process?.env.HOST}`, 302);
  }
  const data = await getTour(tenant, params.tour);
  return json({ data });
};

export default function Tour() {
  const { setCurrentTour } = useContext(TourSiteContext);
  const { data } = useLoaderData<typeof loader>();
  setCurrentTour(data.tour);

  return (
    <div className="hidden md:block">
      <DesktopNavbar tour={data.tour} />
      <div className="grid grid-cols-2 grid-rows-1 h-[calc(100vh-4rem)] grid-flow-row auto-rows-max">
        <StopList tour={data.tour} stops={data.tour.stops} className="mt-24" />
        <div className="fixed right-0 w-1/2 h-full mt-16">
          <TourMap tour={data.tour} />
        </div>
        {data.tour.flatPages.map((flatPage: TTourFlatPage) => {
          return <FlatPage key={flatPage.id} flatPage={flatPage} />;
        })}
        <FlatPage flatPage="about" />
      </div>
      <Outlet />
    </div>
  );
}

// existing code
