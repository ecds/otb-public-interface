import { faBookOpen, faMapMarker } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router";
import { modeIcon } from "~/utils/modeIcon";
import type { TTour } from "~/types";

interface Props {
  tour: TTour;
  className?: string;
}

const TourCard = ({ tour, className }: Props) => {
  return (
    <div
      className={`w-full h-80 border rounded-lg shadow bg-gray-800 border-gray-700 cursor-pointer overflow-hidden hover:shadow-xl transition-shadow duration-300 ${className}`}
    >
      <Link to={`/${tour.slug}`} className="h-full flex flex-col">
        {/* Fixed height image container */}
        <div className="h-48 w-full overflow-hidden rounded-t-lg shrink-0">
          <img
            className="mt-0 w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            src={tour.splash?.url ?? "/images/otblogo.png"}
            alt={tour.title}
          />
        </div>

        {/* Fixed height content container */}
        <div className="h-32 p-4 flex flex-col justify-between">
          <h5 className="text-lg font-bold tracking-tight text-white line-clamp-2 leading-tight">
            {tour.title}
          </h5>
          <div className="flex flex-col items-start justify-between w-full text-gray-200 text-xs mt-auto">
            <div>
              <FontAwesomeIcon icon={faMapMarker} /> {tour.stop_count} Stops
            </div>
            {tour.published ? (
              <>
                <div>
                  <FontAwesomeIcon icon={modeIcon(tour.mode.title)} />{" "}
                  {tour.travel_duration}
                </div>
                <div>
                  <FontAwesomeIcon icon={faBookOpen} /> {tour.read_duration}
                </div>
              </>
            ) : (
              <div>UNPUBLISHED</div>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default TourCard;
