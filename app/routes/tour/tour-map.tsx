import TourMap from "~/components/maps/TourMap";
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
  return (
    <div className="w-screen h-[calc(100vh-8rem)] mt-16">
      <TourMap />
    </div>
  );
};

export default TourMapRoute;
