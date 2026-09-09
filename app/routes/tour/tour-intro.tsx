import { Suspense, useContext, useEffect } from "react";
import { Await } from "react-router";
import MainContent from "~/components/shared/MainContent";
import { TourContext } from "~/contexts/TourContext";
import { useDeviceContext } from "~/hooks/deviceContext";

export default function Tour() {
  const { tour, setCurrentStop } = useContext(TourContext);
  const { isMobile } = useDeviceContext();

  useEffect(() => {
    setCurrentStop(undefined);
  }, [setCurrentStop]);

  if (tour && isMobile) {
    return (
      <Suspense fallback={<div>Loading tour...</div>}>
        <Await resolve={tour}>
          <MainContent content={tour} />
        </Await>
      </Suspense>
    );
  }

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
        <p>Loading...</p>
      </div>
    </div>
  );
}
