import { useContext } from "react";
import { TourContext } from "~/contexts/TourContext";
import FlatPage from "../shared/FlatPage";
import type { TTourFlatPage } from "~/types/TTourFlatPage";

const TourFlatPages = () => {
  const { flatPages } = useContext(TourContext);

  if (flatPages) {
    return (
      <>
        {flatPages.map((flatPage: TTourFlatPage) => {
          return <FlatPage key={flatPage.slug} flatPage={flatPage} />;
        })}
      </>
    );
  }

  return null;
};

export default TourFlatPages;
