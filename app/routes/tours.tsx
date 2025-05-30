import { useEffect, useState } from "react";
import { getTours } from "~/data";
import { Link, useLoaderData, redirect } from "react-router";
import { useDeviceContext } from "~/hooks";
import Navbar from "~/components/shared/Navbar";
import type { TTour } from "~/types/TTour";
import type { LoaderFunctionArgs } from "react-router";

export const loader = async ({ context }: LoaderFunctionArgs) => {
  const { tenant, request } = context;

  if (!tenant) {
    throw redirect(`${request.protocol}://${process?.env.HOST}`);
  }
  const tours: TTour[] = await getTours(tenant);
  return { tours };
};

export const meta = ({ data }: { data: { tours: TTour[] } }) => {
  return [{ title: data.tours[1].attributes.title }];
};

const TourCard = ({ tour }: { tour: TTour }) => {
  return (
    <div className="max-w-sm h-min border  rounded-lg shadow bg-gray-800 border-gray-700 cursor-pointer">
      <Link to={`/${tour.attributes.slug}`}>
        {" "}
        <img
          className="rounded-t-lg max-h-min w-full mx-auto"
          src={tour.attributes.splash?.url ?? "/images/otblogo.png"}
          alt=""
        />
        <div className="p-5">
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-white">
            {tour.attributes.title}
          </h5>
          <div className="flex items-center justify-between width-full text-gray-200 text-sm font-thin">
  <div>{tour.attributes.stop_count} Stops</div>
  <div>About {tour.attributes.est_time}</div>
</div>
        </div>
      </Link>
    </div>
  );
};

const Tours = () => {
  const { tours } = useLoaderData<typeof loader>();
  const [columnCount, setColumnCount] = useState<number>(1);
  const { isDesktop } = useDeviceContext();

  useEffect(() => {
    if (isDesktop) setColumnCount(3);
  }, [isDesktop]);

  return (
    <div className="py-20 md:py-32 bg-gray-800/50">
      <Navbar />
      <div className={`grid grid-cols-${columnCount} gap-4 px-4 md:px-16`}>
        {/* Chunk the tours into columns for a masonry layout. */}
        {[...Array(columnCount).keys()].map((column, index) => {
          return (
            <div key={column} className="grid gap-4">
              {tours
                .filter((_, count) => count % columnCount === index)
                .map((tour) => {
                  return <TourCard tour={tour} key={tour.id} />;
                })}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Tours;
