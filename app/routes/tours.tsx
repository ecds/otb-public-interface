import { getTours, isSignedIn } from "~/data";
import { Link, useLoaderData, redirect } from "react-router";
import type { TTour } from "~/types/TTour";
import type {
  ClientLoaderFunctionArgs,
  LoaderFunctionArgs,
} from "react-router";
import { useContext } from "react";
import TourSiteContext from "~/contexts/tourSiteContext";

export const loader = async ({ context }: LoaderFunctionArgs) => {
  const { tenant, request } = context;
  if (!tenant) {
    throw redirect(`${request.protocol}://${process?.env.HOST}`);
  }
  const tours: TTour[] = await getTours(tenant);
  return { tenant, tours };
};

export async function clientLoader({ serverLoader }: ClientLoaderFunctionArgs) {
  const { tenant, tours } = await serverLoader<typeof loader>();
  const signedIn = await isSignedIn();
  if (signedIn) {
    const allTours: TTour[] = await getTours(tenant);
    return { tours: allTours };
  }
  return { tours };
}

clientLoader.hydrate = true as const;

export const meta = ({ data }: { data: { tours: TTour[] } }) => {
  return [{ title: data?.tours?.[0]?.tenant || "Tours" }];
};

const TourCard = ({ tour }: { tour: TTour }) => {
  return (
    <div className="w-full h-80 border rounded-lg shadow bg-gray-800 border-gray-700 cursor-pointer overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <Link to={`/${tour.slug}`} className="h-full flex flex-col">
        {/* Fixed height image container */}
        <div className="h-48 w-full overflow-hidden rounded-t-lg flex-shrink-0">
          <img
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            src={tour.splash?.url ?? "/images/otblogo.png"}
            alt={tour.title}
          />
        </div>

        {/* Fixed height content container */}
        <div className="h-32 p-4 flex flex-col justify-between">
          <h5 className="text-lg font-bold tracking-tight text-white line-clamp-2 leading-tight">
            {tour.title}
          </h5>
          <div className="flex items-center justify-between w-full text-gray-200 text-sm mt-auto">
            <div>{tour.stop_count} Stops</div>
            <div>{tour.est_time}</div>
          </div>
        </div>
      </Link>
    </div>
  );
};

const Tours = () => {
  const { currentSite } = useContext(TourSiteContext);
  const { tours } = useLoaderData<typeof loader>();

  return (
    <div className="min-h-screen py-20 md:py-32 bg-gray-800/50">
      {/* <Navbar /> */}
      <nav className={`bg-default-primary h-16 fixed top-0 w-screen z-50`}>
        <div className="flex items-center justify-between mx-auto px-4">
          {/* Desktop */}
          <div className="flex flex-shrink-0 items-center">
            <Link className="hidden md:block" to="/">
              <img
                className="h-16 w-auto p-2"
                src={currentSite?.logo_url ?? "/images/otblogo.png"}
                alt=""
              />
            </Link>
            <h1 className="ml-2 md:ml-6 sm:block text-white text-lg font-medium">
              {currentSite?.name}
            </h1>
          </div>
        </div>
      </nav>
      {/* <div className="px-4 md:px-16 mb-8">
        <h1 className="text-3xl font-bold text-white text-center mb-2">
          Explore Tours
        </h1>
        <p className="text-gray-300 text-center">
          Discover {tours?.length || 0} amazing tours
        </p>
      </div> */}

      {/* RESPONSIVE GRID WITH FIXED SIZE CARDS */}
      <div className="px-4 md:px-16">
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {tours?.map((tour) => (
            <TourCard tour={tour} key={tour.slug} />
          ))}
        </div>

        {/* Empty State */}
        {(!tours || tours.length === 0) && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg">
              No tours available at the moment.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tours;
