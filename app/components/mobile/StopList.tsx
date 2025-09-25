import { useContext } from "react";
import { Link } from "react-router";
import { TourContext } from "~/contexts/tourContext";

interface Props {}

const StopList = ({}: Props) => {
  const { stops, tour } = useContext(TourContext);
  return (
    <ol className="my-16">
      {stops?.map((stop) => {
        return (
          <li className="flex flex-row w-screen border border-b">
            <div className="max-w-[33%] p-2 h-auto">
              <img src={stop.attributes.splash.url} alt="" />
            </div>
            <Link to={`/${tour?.attributes.slug}/${stop.attributes.slug}`}>
              <h2 className="text-xl p-2">{stop.attributes.title}</h2>
            </Link>
          </li>
        );
      })}
    </ol>
  );
};

export default StopList;
