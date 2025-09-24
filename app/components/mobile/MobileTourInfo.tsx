import TextToSpeechButton from "~/components/shared/TextToSpeechButton";
import type { TTour } from "~/types/TTour";

interface Props {
  tour: TTour;
}

const MobileTourInfo = ({ tour }: Props) => {
  return (
    <div className="bg-white">
      <div className="p-4">
        <div className="mb-4">
          <img 
            src={tour.attributes.splash?.url || "/images/otblogo.png"}
            alt={tour.attributes.title}
            className="w-full h-48 object-cover rounded"
          />
        </div>

        <div className="flex items-start justify-between mb-3">
          <h2 className="text-xl font-bold text-gray-900 flex-1 mr-3">
            {tour.attributes.title}
          </h2>
          <TextToSpeechButton 
            text={tour.attributes.description}
            variant="headphones"
            size="md"
          />
        </div>

        <div 
          className="text-gray-700 leading-relaxed mb-8"
          dangerouslySetInnerHTML={{ __html: tour.attributes.description }}
        />
        
        {/* Add some extra content to test scrolling */}
        <div className="space-y-4 text-gray-600 text-sm">
          <p>Tour Details:</p>
          <p>• Number of stops: {tour.attributes.stop_count}</p>
          <p>• Estimated time: {tour.attributes.est_time}</p>
          <p>• Location: {tour.attributes.tenant_title}</p>
          
          {/* Add placeholder content to ensure scrolling works */}
          <div className="mt-8 space-y-4">
            <h3 className="font-semibold text-gray-800">About This Tour</h3>
            <p>This interactive tour will guide you through historical locations using your device's GPS.</p>
            <p>Make sure to enable location services for the best experience.</p>
            <p>Each stop contains rich media content including images, videos, and detailed historical information.</p>
            <p>Take your time at each location to fully experience the historical significance.</p>
            <p>The tour is designed to be self-paced, so you can move between stops at your own speed.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileTourInfo;