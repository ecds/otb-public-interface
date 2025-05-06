import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faClose } from "@fortawesome/free-solid-svg-icons";
import { useContext, useState } from "react";
import { TourContext } from "~/contexts/tourContext";

const TourMenu = () => {
  const { flatPages } = useContext(TourContext);
  const [open, setOpen] = useState<boolean>(false);
  return (
    <>
      <button
        className="block md:hidden text-lg text-white ml-2"
        onClick={() => setOpen(!open)}
      >
        <FontAwesomeIcon icon={faBars} />
        <span className="sr-only">Menu</span>
      </button>
      <div
        className={`block md:hidden otb-flat-page z-50 fixed left-0 w-3/4 top-0 text-sm h-screen bg-black/95 text-gray-300 overflow-scroll transition-transform duration-700 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="grid grid-cols-2 my-2 border-b border-white">
          <ul className="py-4 px-6">
            <li className="mb-2">All Tours</li>
            <li className="mb-2">Tour Home</li>
            {flatPages?.map((flatPage) => {
              return <li key={flatPage.id}>{flatPage.attributes.title}</li>;
            })}
          </ul>
          <button
            className="text-white/80 rounded mt-2 w-fit inline-flex justify-self-end pr-4 text-3xl"
            onClick={() => setOpen(!open)}
          >
            <FontAwesomeIcon icon={faClose} />{" "}
            <span className="sr-only">Close</span>
          </button>
        </div>
        <p className="uppercase m-0 px-6 mt-4">Location Controls</p>
        <ul className="py-1 px-6">
          <li className="mb-1 flex w-full">
            <span className="block flex-grow">Cookies BLOCKED</span>
            <button className="justify-self-end">switch</button>
          </li>
          <li className="mb-1 flex">
            <span className="block flex-grow">Current Location OFF</span>
            <button className="justify-self-end">switch</button>
          </li>
          <li className="mb-1 flex">
            <span className="block flex-grow">Update Location OFF</span>
            <button className="justify-self-end">switch</button>
          </li>
        </ul>
      </div>
    </>
  );
};

export default TourMenu;
