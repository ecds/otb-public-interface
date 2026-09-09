import { useContext } from "react";
import MainContent from "~/components/shared/MainContent";
import { TourContext } from "~/contexts/TourContext";
import { useDeviceContext } from "~/hooks/deviceContext";
import type { MetaFunction } from "react-router";
import type { TTour } from "~/types";

export const meta: MetaFunction = ({ matches, params }) => {
  const data = matches.find((m) => m.id === "routes/tour")?.loaderData as
    | { tour?: TTour }
    | undefined;
  const stop = data?.tour?.stops.find((s) =>
    s.slugs.includes(params.stop ?? ""),
  );
  return [
    { title: stop?.title ?? data?.tour?.title ?? "Stop" },
    { name: "description", content: stop?.meta_description ?? "" },
    {
      property: "og:image",
      content:
        stop?.splash?.url ?? data?.tour?.splash?.url ?? "/images/otblogo.png",
    },
  ];
};

const StopIntroRoute = () => {
  const { currentStop } = useContext(TourContext);
  const { isMobile } = useDeviceContext();

  if (currentStop && isMobile) {
    return <MainContent content={currentStop} />;
  }

  return <></>;
};

export default StopIntroRoute;
