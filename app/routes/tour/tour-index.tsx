import { Suspense, useContext, useEffect, useState } from "react";
import { redirect, useNavigate } from "react-router";
import { Await } from "react-router";
import { TourContext } from "~/contexts/tourContext";
import { useDeviceContext } from "~/hooks";
import MainContent from "~/components/shared/MainContent";

export default function TourIndex() {
  const { tour } = useContext(TourContext);
  const { isMobile } = useDeviceContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (isMobile) navigate(`/${tour?.attributes.slug}/intro`);
  }, [isMobile, tour]);

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
        <p>Loading...</p>
      </div>
    </div>
  );
}
