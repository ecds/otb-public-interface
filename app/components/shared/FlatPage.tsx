import { faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
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
      <DialogTitle as="h2" className="text-2xl">
        {flatPage.title}
      </DialogTitle>
      <div
        className="prose prose-invert mb-12"
        dangerouslySetInnerHTML={{
          __html: flatPage.body,
        }}
      />
    </>
  );
};

const FlatPage = ({ flatPage }: Props) => {
  const { currentFlatPage, setCurrentFlatPage } = useContext(TourContext);

  // A dialog, so focus moves into the page, stays there, and returns to the
  // link that opened it.
  return (
    <Dialog
      open={currentFlatPage === flatPage}
      onClose={() => setCurrentFlatPage(undefined)}
      className="relative z-50"
    >
      <DialogPanel
        transition
        className="otb-flat-page fixed -top-16 md:top-auto left-0 md:left-auto md:right-0 w-full md:w-1/2 h-full mt-16 bg-black md:bg-black/85 text-gray-300 overflow-scroll transition-transform duration-700 data-closed:-translate-x-full md:data-closed:translate-x-full motion-reduce:transition-none"
      >
        <div className="sticky top-0 w-full bg-black px-6">
          <button
            className="my-4 bg-white text-black rounded p-2 cursor-pointer"
            onClick={() => setCurrentFlatPage(undefined)}
          >
            <FontAwesomeIcon icon={faClose} aria-hidden="true" /> Close
          </button>
        </div>
        <div className="px-6 md:p-6">
          <RenderFlatPage flatPage={flatPage} />
        </div>
      </DialogPanel>
    </Dialog>
  );
};

export default FlatPage;
