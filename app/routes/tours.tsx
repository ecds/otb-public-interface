import { faList, faMap, faTable } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { useEffect, useState } from "react";
import { Link, useLoaderData, redirect, useNavigate } from "react-router";
import TourCard from "~/components/shared/TourCard";
import TourSetMap from "~/components/shared/TourSetMap";
import { requestContext, tenantContext } from "~/context";
import { getTours, isSignedIn } from "~/data";
import type {
  ClientLoaderFunctionArgs,
  LoaderFunctionArgs,
} from "react-router";
import type { TTour, TTourSetPreview } from "~/types";

export const loader = async ({ context }: LoaderFunctionArgs) => {
  const tenant = context.get(tenantContext);
  const request = context.get(requestContext);
  if (!tenant) {
    throw redirect(`${request.protocol}://${process?.env.HOST}`);
  }
  const { tour_set, tours }: { tour_set: TTourSetPreview; tours: TTour[] } =
    await getTours(tenant);
  return { tenant, tour_set, tours };
};

export async function clientLoader({ serverLoader }: ClientLoaderFunctionArgs) {
  const { tenant, tour_set, tours } = await serverLoader<typeof loader>();
  const signedIn = await isSignedIn();
  if (signedIn) {
    const { tours: allTours, tour_set: myTourSet } = await getTours(tenant);
    return { tours: allTours, tour_set: myTourSet };
  }
  return { tour_set, tours };
}

clientLoader.hydrate = true as const;

const Tours = () => {
  const { tour_set, tours } = useLoaderData<typeof loader>();
  const [introExpanded, setIntroExpanded] = useState<boolean>(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (tours && tours.length === 1) navigate(`/${tours[0].slug}`);
  }, [tours, navigate]);

  if (!tour_set) return <></>;

  return (
    <div className="min-h-screen py-20 md:py-24 bg-gray-800/50">
      {/* <Navbar /> */}
      <nav className={`bg-default-primary h-16 fixed top-0 w-screen z-50`}>
        <div className="flex items-center justify-between mx-auto px-4">
          {/* Desktop */}
          <div className="flex shrink-0 items-center">
            <Link className="" to="/">
              <img
                className="h-16 w-auto p-2"
                src={tour_set.logo_url ?? "/images/otblogo.png"}
                alt=""
              />
            </Link>
            <h1 className="ml-2 md:ml-6 sm:block text-white text-lg font-medium">
              {tour_set.name}
            </h1>
          </div>
        </div>
      </nav>

      <div className="w-full">
        <TabGroup>
          <TabList
            className={`flex gap-4 px-4 md:px-0 mb-4 md:mb-6 prose mx-auto`}
          >
            <Tab
              className={`flex flex-row gap-2 items-center text-sm py-1 md:py-0 md:text-lg cursor-pointer bg-white text-gray-800 rounded-md px-2 data-selected:bg-gray-800 data-selected:text-white opacity-80 data-selected:opacity-100 hover:bg-gray-500 hover:text-white`}
            >
              <FontAwesomeIcon icon={faList} className="md:hidden!" />
              <FontAwesomeIcon
                icon={faTable}
                className="hidden! md:block!"
              />{" "}
              List
            </Tab>
            <Tab
              className={`flex flex-row gap-2 items-center text-sm py-1 md:py-0 md:text-lg cursor-pointer bg-white text-gray-800 rounded-md px-2 data-selected:bg-gray-800 data-selected:text-white opacity-80 data-selected:opacity-100 hover:bg-gray-500 hover:text-white`}
            >
              <FontAwesomeIcon icon={faMap} /> Map
            </Tab>
          </TabList>
          <TabPanels className="px-4 md:px-16">
            {/* RESPONSIVE GRID WITH FIXED SIZE CARDS */}
            <TabPanel className={``}>
              <div
                className={`mx-auto bg-white rounded-md p-4 md:p-6 mb-4 md:mb-6 max-w-[65ch] ${!tour_set.description ? "hidden" : ""}`}
              >
                <div
                  className={`prose ${introExpanded ? "max-h-full overflow-auto" : "max-h-[12ch] overflow-hidden"} md:max-h-full md:overflow-auto`}
                  dangerouslySetInnerHTML={{
                    __html: tour_set.description,
                  }}
                />
                <button
                  className={`block md:hidden bg-blue-500 px-1 text-white rounded-md`}
                  onClick={() => setIntroExpanded(!introExpanded)}
                >
                  {introExpanded ? "Show Less" : "Show More"}
                </button>
              </div>
              <div
                className={`prose grid gap-6 grid-cols-1 ${"sm:grid-cols-2"} ${tours.length >= 2 ? "md:grid-cols-2" : "md:grid-cols-1"} mx-auto content-center`}
              >
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
            </TabPanel>
            <TabPanel>
              {tours && (
                <TourSetMap tours={tours.filter((tour) => tour.bounds)} />
              )}
            </TabPanel>
          </TabPanels>
        </TabGroup>
      </div>
    </div>
  );
};

export default Tours;
