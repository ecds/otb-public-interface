import TourMenu from "~/components/mobile/TourMenu";

interface Props {
  tourTitle: string;
}

const MobileNavbar = ({ tourTitle }: Props) => {
  return (
    <div className="bg-gray-800 text-white p-3 flex items-center justify-between">
      <TourMenu />
      <h1 className="text-sm font-medium truncate mx-2">{tourTitle}</h1>
      <div className="w-6" />
    </div>
  );
};

export default MobileNavbar;