import ClientOnly from "~/components/ClientOnly";
import TourMap from "~/components/shared/TourMap.client";

const TourMapRoute = () => {
  return (
    // The top and bottom navbars have height of 64px, hence the 100vh - 128px.
    <div className="w-screen h-[calc(100vh-128px)] mt-16">
      <ClientOnly>
        <TourMap />
      </ClientOnly>
    </div>
  );
};

export default TourMapRoute;
