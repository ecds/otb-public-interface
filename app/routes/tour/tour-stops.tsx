import MobileStopsList from "~/components/mobile/MobileStopsList";
import { pageTitle } from "~/utils/pageTitle";
import type { MetaFunction } from "react-router";
import type { TTour } from "~/types";

export const meta: MetaFunction = ({ matches }) => {
  const data = matches.find((m) => m.id === "routes/tour")?.loaderData as
    | { tour?: TTour }
    | undefined;
  return [{ title: pageTitle("Stops", data?.tour?.title) }];
};

const TourStopsRoute = () => {
  return <MobileStopsList />;
};

export default TourStopsRoute;
