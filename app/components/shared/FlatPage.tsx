import { faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext } from "react";
import { TourContext } from "~/contexts/TourContext";
import AboutOTB from "./AboutOTB";
import type { TTourFlatPage } from "~/types";

interface Props {
  flatPage: TTourFlatPage | string;
}

const RenderFlatPage = ({ flatPage }: Props) => {
  if (typeof flatPage === "string") {
    return <AboutOTB />;
  }

  return (
    <>
      <h3 className="text-2xl">{flatPage.title}</h3>
      <div
        className="text-white"
        dangerouslySetInnerHTML={{
          __html: flatPage.body,
        }}
      />
    </>
  );
};

const FlatPage = ({ flatPage }: Props) => {
  const { currentFlatPage, setCurrentFlatPage } = useContext(TourContext);

  return (
    <div
      className={`otb-flat-page fixed -top-16 z-50 md:top-auto left-0 md:left-auto md:right-0 w-full md:w-1/2 h-full mt-16 bg-black md:bg-black/85 text-gray-300 overflow-scroll transition-transform duration-700 ${
        currentFlatPage === flatPage
          ? "-translate-x-0 md:-translate-x"
          : "-translate-x-full md:translate-x-full"
      }`}
    >
      <div className="sticky top-0 w-full bg-black px-6">
        <button
          className="my-4 bg-white text-black rounded p-2 cursor-pointer"
          onClick={() => setCurrentFlatPage(undefined)}
        >
          <FontAwesomeIcon icon={faClose} /> Close
        </button>
      </div>
      <div className="px-6 md:p-6">
        <RenderFlatPage flatPage={flatPage} />
      </div>
    </div>
  );
};

export default FlatPage;
