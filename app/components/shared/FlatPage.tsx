import { useContext } from "react";
import TourSiteContext from "~/contexts/tourSiteContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";

import type { TTourFlatPage } from "~/types/TTourFlatPage";
import AboutOTB from "./AboutOTB";

interface Props {
  flatPage: TTourFlatPage | string;
}

const RenderFlatPage = ({ flatPage }: Props) => {
  if (typeof flatPage === "string") {
    return <AboutOTB />;
  }

  return (
    <>
      <h3 className="text-2xl">{flatPage.attributes.title}</h3>
      <div
        className="text-white"
        dangerouslySetInnerHTML={{
          __html: flatPage.attributes.body,
        }}
      />
    </>
  );
};

const FlatPage = ({ flatPage }: Props) => {
  const { currentFlatPage, setCurrentFlatPage } = useContext(TourSiteContext);

  return (
    <div
      className={`otb-flat-page fixed right-0 w-1/2 h-full mt-16 bg-black/85 text-gray-300 overflow-scroll transition-transform duration-700 ${
        currentFlatPage === flatPage ? "-" : ""
      }translate-x-full`}
    >
      <div className="sticky top-0 w-full bg-black px-6">
        <button
          className="my-4 bg-white text-black rounded p-2"
          onClick={() => setCurrentFlatPage(undefined)}
        >
          <FontAwesomeIcon icon={faClose} /> Close
        </button>
      </div>
      <div className="p-6">
        <RenderFlatPage flatPage={flatPage} />
      </div>
    </div>
  );
};

export default FlatPage;
