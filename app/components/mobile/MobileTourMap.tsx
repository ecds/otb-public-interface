import { useContext, useEffect, useState } from "react";
import {
  APIProvider,
  AdvancedMarker,
  Map,
  Pin,
} from "@vis.gl/react-google-maps";
import { TourContext } from "~/contexts/tourContext";
import TourSiteContext from "~/contexts/tourSiteContext";
import { getTourStops } from "~/data";
import type { TTour } from "~/types/TTour";
import type { TStop } from "~/types/TStop";

interface Props {
  tour: TTour;
  stops?: TStop[];
}

const MobileTourMap = ({ tour, stops: propStops }: Props) => {
  const { currentStop, setCurrentStop, stops, setStops } = useContext(TourContext);
  const { tenant } = useContext(TourSiteContext);
  const [loading, setLoading] = useState(true);

  // Use stops from context if available, otherwise use props
  const activeStops = stops || propStops;

  // Fetch stops if not available
  useEffect(() => {
    const fetchStops = async () => {
      if (!tenant || !tour || stops) return;
      
      try {
        setLoading(true);
        const fetchedStops = await getTourStops({ tenant, tour });
        setStops(fetchedStops);
      } catch (error) {
        console.error('Error fetching stops:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStops();
  }, [tenant, tour, stops, setStops]);

  const handleMarkerClick = (stop: TStop) => {
    setCurrentStop(stop);
    console.log('Marker clicked:', stop.attributes.title);
  };

  if (loading && !activeStops) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full relative">
      <APIProvider apiKey={"AIzaSyD-G_lDtvChv-P3nchtQYHoCLfFzn9ylr8"}>
        <Map
          defaultBounds={{
            east: tour.attributes.bounds.east,
            south: tour.attributes.bounds.south,
            north: tour.attributes.bounds.north,
            west: tour.attributes.bounds.west,
          }}
          disableDefaultUI
          mapId={"bf51a910020fa25a"}
          className="w-full h-full"
        >
          {activeStops?.map((stop, index) => {
            const lat = parseFloat(stop.attributes.lat);
            const lng = parseFloat(stop.attributes.lng);
            
            // Skip if coordinates are invalid
            if (isNaN(lat) || isNaN(lng)) {
              console.warn('Invalid coordinates for stop:', stop.attributes.title);
              return null;
            }

            return (
              <AdvancedMarker
                key={`${stop.id}-${index}`}
                position={{ lat, lng }}
                title={stop.attributes.title}
                onClick={() => handleMarkerClick(stop)}
                zIndex={stop === currentStop ? activeStops.length + 1 : index}
              >
                <Pin 
                  scale={stop === currentStop ? 1.3 : 1.1}
                  background={stop === currentStop ? "#dc2626" : "#ef4444"}
                  borderColor={stop === currentStop ? "#991b1b" : "#dc2626"}
                  glyphColor="white"
                >
                  <span className={`text-white font-bold ${stop === currentStop ? "text-lg" : "text-sm"}`}>
                    {stop.attributes.position}
                  </span>
                </Pin>
              </AdvancedMarker>
            );
          })}
        </Map>
      </APIProvider>
      
      {/* Debug info */}
      {activeStops && (
        <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
          {activeStops.length} stops loaded
        </div>
      )}
    </div>
  );
};

export default MobileTourMap;
