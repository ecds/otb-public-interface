// app/components/shared/TourCard.tsx
import React from "react";
import { Link } from "react-router";
import type { TTour } from "~/types/TTour";

interface TourCardProps {
  tour: TTour;
  showLogo?: boolean;
}

/**
 * TourCard component that matches the Americus History Trails design
 */
const TourCard: React.FC<TourCardProps> = ({ tour, showLogo = true }) => {
  const mainImage = tour.attributes.splash?.url || "/images/otblogo.png";
  
  return (
    <div className="max-w-md mx-auto bg-white shadow-md overflow-hidden mb-6">
      {/* Main Image */}
      <div className="relative">
        {showLogo && (
          <div className="absolute top-0 left-0 p-3 flex items-center z-10">
            <div className="bg-gray-600 rounded-full p-2 mr-2">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path>
              </svg>
            </div>
            <span className="text-white font-medium">Georgia Humanities</span>
          </div>
        )}
        
        <img 
          src={mainImage} 
          alt={tour.attributes.title} 
          className="w-full object-cover"
          style={{ height: "260px" }} 
        />
      </div>
      
      {/* Title and Info Section */}
      <div className="p-4">
        <h2 className="text-xl font-bold text-gray-900">
          {tour.attributes.title}
        </h2>
        
        <div className="flex items-center mt-2 text-gray-600 text-sm">
          <span>{tour.attributes.stop_count} Stops</span>
          <span className="mx-2 text-gray-300">|</span>
          <span>About {tour.attributes.est_time}</span>
        </div>
      </div>
    </div>
  );
};

export default TourCard;