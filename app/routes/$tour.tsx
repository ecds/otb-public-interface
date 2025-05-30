// Updated Tours.tsx - Fixed dynamic grid-cols
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
    <div className="max-w-sm h-min border rounded-lg shadow bg-gray-800 border-gray-700 cursor-pointer">
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
            <div>{tour.attributes.est_time}</div>
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

  // Use conditional rendering for different column layouts
  return (
    <div className="py-20 md:py-32 bg-gray-800/50">
      <Navbar />
      {columnCount === 1 && (
        <div className="grid grid-cols-1 gap-4 px-4 md:px-16">
          {tours.map((tour) => (
            <TourCard tour={tour} key={tour.id} />
          ))}
        </div>
      )}
      {columnCount === 2 && (
        <div className="grid grid-cols-2 gap-4 px-4 md:px-16">
          {/* Split tours into two columns */}
          <div className="grid gap-4">
            {tours
              .filter((_, index) => index % 2 === 0)
              .map((tour) => (
                <TourCard tour={tour} key={tour.id} />
              ))}
          </div>
          <div className="grid gap-4">
            {tours
              .filter((_, index) => index % 2 === 1)
              .map((tour) => (
                <TourCard tour={tour} key={tour.id} />
              ))}
          </div>
        </div>
      )}
      {columnCount === 3 && (
        <div className="grid grid-cols-3 gap-4 px-4 md:px-16">
          {/* Split tours into three columns */}
          <div className="grid gap-4">
            {tours
              .filter((_, index) => index % 3 === 0)
              .map((tour) => (
                <TourCard tour={tour} key={tour.id} />
              ))}
          </div>
          <div className="grid gap-4">
            {tours
              .filter((_, index) => index % 3 === 1)
              .map((tour) => (
                <TourCard tour={tour} key={tour.id} />
              ))}
          </div>
          <div className="grid gap-4">
            {tours
              .filter((_, index) => index % 3 === 2)
              .map((tour) => (
                <TourCard tour={tour} key={tour.id} />
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Tours;