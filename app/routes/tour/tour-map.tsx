import ClientOnly from "~/components/ClientOnly";
import MobileTourMap from "~/components/mobile/MobileTourMap";

const TourMapRoute = () => {
  return (
    <ClientOnly>
      <MobileTourMap />
    </ClientOnly>
  );
};

export default TourMapRoute;
