import { useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faList } from "@fortawesome/free-solid-svg-icons";
import { TourContext } from "~/contexts/TourContext";
import { useNavigate } from "react-router";

const MobileStopsList = () => {
  const { tour } = useContext(TourContext);
  const navigate = useNavigate();

  if (!tour || !tour.stops || tour.stops.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        <FontAwesomeIcon icon={faList} className="text-3xl mb-2" />
        <p>No stops available</p>
      </div>
    );
  }

  return (
    <div className="bg-white pt-16">
      {tour.stops.map((stop) => (
        <button
          key={stop.slug}
          role="link"
          className="flex items-center p-4 border-b border-gray-200 hover:bg-gray-50 active:bg-gray-100"
          onClick={() => navigate(`/${tour.slug}/${stop.slug}/intro`)}
        >
          <div className="w-16 h-16 mr-3 shrink-0">
            <img
              src={stop.splash?.url || "/images/otblogo.png"}
              alt={stop.title}
              className="w-full h-full object-cover rounded"
            />
          </div>
          <div className="flex-1 cursor-pointer text-left">
            <h3 className="font-medium text-gray-900 text-sm">{stop.title}</h3>
            <p className="text-xs text-gray-500 mt-1 line-clamp-2">
              {stop.description?.replace(/<[^>]*>/g, "").substring(0, 80)}
              ...
            </p>
          </div>
        </button>
      ))}
    </div>
  );
};

export default MobileStopsList;
