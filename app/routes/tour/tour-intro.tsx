import { useContext, useEffect } from "react";
import MainContent from "~/components/shared/MainContent";
import { TourContext } from "~/contexts/TourContext";
import { useDeviceContext } from "~/hooks/deviceContext";
import { pageTitle } from "~/utils/pageTitle";
import type { MetaFunction } from "react-router";
import type { TTour } from "~/types";

export const meta: MetaFunction = ({ matches }) => {
  const data = matches.find((m) => m.id === "routes/tour")?.loaderData as
    | { tour?: TTour; tour_set?: { name?: string } }
    | undefined;
  return [
    { title: pageTitle(data?.tour?.title ?? "Tour", data?.tour_set?.name) },
    { name: "description", content: data?.tour?.sanitized_description ?? "" },
    {
      property: "og:image",
      content: data?.tour?.splash?.url ?? "/images/otblogo.png",
    },
  ];
};

export default function Tour() {
  const { tour, setCurrentStop } = useContext(TourContext);
  const { isMobile } = useDeviceContext();

  useEffect(() => {
    setCurrentStop(undefined);
  }, [setCurrentStop]);

  if (tour && isMobile) {
    return <MainContent content={tour} />;
  }

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center" role="status">
        <div
          aria-hidden="true"
          className="motion-safe:animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"
        ></div>
        <p>Loading...</p>
      </div>
    </div>
  );
}
