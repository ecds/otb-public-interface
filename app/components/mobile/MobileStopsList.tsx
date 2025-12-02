import { useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faList } from "@fortawesome/free-solid-svg-icons";
import { TourContext } from "~/contexts/TourContext";
import TextToSpeechButton from "~/components/shared/TextToSpeechButton";
import type { TStop } from "~/types/TStop";
import { useNavigate } from "react-router";

const MobileStopsList = () => {
  const { tour, stops } = useContext(TourContext);
  const navigate = useNavigate();

  if (!stops || stops.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        <FontAwesomeIcon icon={faList} className="text-3xl mb-2" />
        <p>No stops available</p>
      </div>
    );
  }

  return (
    <div className="bg-white pt-16">
      {stops.map((stop) => (
        <button
          key={stop.id}
          role="link"
          className="flex items-center p-4 border-b border-gray-200 hover:bg-gray-50 active:bg-gray-100"
          onClick={() =>
            navigate(`/${tour?.attributes.slug}/${stop.attributes.slug}/intro`)
          }
        >
          <div className="w-16 h-16 mr-3 flex-shrink-0">
            <img
              src={stop.attributes.splash?.url || "/images/otblogo.png"}
              alt={stop.attributes.title}
              className="w-full h-full object-cover rounded"
            />
          </div>
          <div className="flex-1 cursor-pointer">
            <h3 className="font-medium text-gray-900 text-sm">
              {stop.attributes.title}
            </h3>
            <p className="text-xs text-gray-500 mt-1 line-clamp-2">
              {stop.attributes.description
                ?.replace(/<[^>]*>/g, "")
                .substring(0, 80)}
              ...
            </p>
          </div>
          {/* <div className="flex items-center space-x-2 ml-2">
            <TextToSpeechButton
              text={stop.attributes.description}
              variant="headphones"
              size="sm"
            />
            <div className="text-xs text-gray-400 bg-gray-100 rounded-full w-6 h-6 flex items-center justify-center">
              {stop.attributes.position}
            </div>
          </div> */}
        </button>
      ))}
    </div>
  );
};

export default MobileStopsList;
