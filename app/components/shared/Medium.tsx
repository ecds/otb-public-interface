import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlay } from "@fortawesome/free-solid-svg-icons";
import type { TTourMedium } from "~/types/TTour";

interface Props {
  medium: TTourMedium;
  onClick?: (index: number) => void;
  index?: number;
}

const Medium = ({ medium, onClick, index = 0 }: Props) => {
  // const { resize } = useContext(ScrollamaContext);
  // const [loaded, setLoaded] = useState<boolean>(false);

  // useEffect(() => {
  //   if (resize && loaded) resize();
  // }, [resize, loaded]);

  const handleClick = () => {
    if (onClick) onClick(index);
  };

  return (
    <div className={`relative flex items-baseline h-64 md:h-[33vh]`}>
      <button
        className={`m-auto h-full w-5/6 bg-contain bg-center bg-no-repeat flex flex-col-reverse`}
        style={{ backgroundImage: `url(${medium.files.desktop})` }}
        onClick={handleClick}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleClick();
          }
        }}
      >
        {medium.title && (
          <div className="w-full bg-black/60 text-white py-1 rounded-md">
            {medium.title}
          </div>
        )}
        {/* <img
          className={`max-w-64 md:w-full m-auto cursor-pointer transition-opacity duration-1000 ${
            loaded ? "opacity-100" : "opacity-0"
          }`}
          srcSet={medium.files.desktop}
          alt={medium.caption ?? ""}
          onLoad={() => setLoaded(true)}
        /> */}
      </button>
      {medium.video && (
        <div className="absolute left-1/2 -translate-x-12 top-1/2 -translate-y-12 text-center text-[6rem] text-black bg-white/75 rounded-full mx-auto flex">
          <FontAwesomeIcon className="" icon={faCirclePlay} />
        </div>
      )}
    </div>
  );
};

export default Medium;
