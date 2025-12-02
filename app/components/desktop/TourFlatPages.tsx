import { useContext, useEffect } from "react";
import { TourContext } from "~/contexts/TourContext";
import { getTourFlatPages } from "~/data";
import FlatPage from "../shared/FlatPage";
import TourSiteContext from "~/contexts/tourSiteContext";
import type { TTourFlatPage } from "~/types/TTourFlatPage";

const TourFlatPages = () => {
  const { tour, flatPages, setFlatPages } = useContext(TourContext);
  const { tenant } = useContext(TourSiteContext);

  useEffect(() => {
    const fetchFlatPages = async () => {
      if (!tenant || !tour || !tour.relationships.tour_flat_pages) return;
      const _flatPages = await getTourFlatPages({ tenant, tour });
      setFlatPages(_flatPages);
    };

    fetchFlatPages();
  }, [tour, tenant, setFlatPages]);

  if (flatPages) {
    return (
      <>
        {flatPages.map((flatPage: TTourFlatPage) => {
          return <FlatPage key={flatPage.id} flatPage={flatPage} />;
        })}
      </>
    );
  }

  return null;
};

export default TourFlatPages;
