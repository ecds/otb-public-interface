import { useContext } from "react";
import { TourContext } from "~/contexts/TourContext";
import FlatPage from "../shared/FlatPage";
import type { TTourFlatPage } from "~/types/TTourFlatPage";

const TourFlatPages = () => {
  const { tour } = useContext(TourContext);

  if (tour && tour.flat_pages) {
    return (
      <>
        {tour.flat_pages.map((flatPage: TTourFlatPage) => {
          return <FlatPage key={flatPage.slug} flatPage={flatPage} />;
        })}
      </>
    );
  }

  return null;
};

export default TourFlatPages;
