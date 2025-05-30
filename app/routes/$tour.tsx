import { getTours } from "~/data";
import { Link, useLoaderData, redirect } from "react-router";
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
  return [{ title: data?.tours?.[0]?.attributes?.title || "Tours" }];
};

const TourCard = ({ tour }: { tour: TTour }) => {
  return (
    <div className="w-full h-80 border rounded-lg shadow bg-gray-800 border-gray-700 cursor-pointer overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <Link to={`/${tour.attributes.slug}`} className="block h-full flex flex-col">
        {/* Fixed height image container */}
        <div className="h-48 w-full overflow-hidden rounded-t-lg flex-shrink-0">
          <img
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            src={tour.attributes.splash?.url ?? "/images/otblogo.png"}
            alt={tour.attributes.title}
          />
        </div>
        
        {/* Fixed height content container */}
        <div className="h-32 p-4 flex flex-col justify-between">
          <h5 className="text-lg font-bold tracking-tight text-white line-clamp-2 leading-tight">
            {tour.attributes.title}
          </h5>
          <div className="flex items-center justify-between w-full text-gray-200 text-sm">
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

  return (
    <div className="min-h-screen py-20 md:py-32 bg-gray-800/50">
      <Navbar />
      
      <div className="px-4 md:px-16 mb-8">
        <h1 className="text-2xl font-bold text-white text-center mb-2">
          Explore Tours
        </h1>
        <p className="text-gray-300 text-center">
          Discover {tours?.length || 0} amazing tours
        </p>
      </div>

      {/* RESPONSIVE GRID WITH FIXED SIZE CARDS */}
      <div className="px-4 md:px-16">
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {tours?.map((tour) => (
            <TourCard tour={tour} key={tour.id} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Tours;