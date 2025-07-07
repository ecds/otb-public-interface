import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";

interface Props {
  tourTitle: string;
}

const MobileNavbar = ({ tourTitle }: Props) => {
  return (
    <div className="bg-gray-800 text-white p-3 flex items-center justify-between">
      <FontAwesomeIcon icon={faBars} className="text-lg" />
      <h1 className="text-sm font-medium truncate mx-2">{tourTitle}</h1>
      <div className="w-6" />
    </div>
  );
};

export default MobileNavbar;