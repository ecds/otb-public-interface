import { redirect, useLoaderData } from "react-router";
import ClientOnly from "~/components/ClientOnly";
import AllToursMap from "~/components/index/AllToursMap";
import { requestContext, tenantContext } from "~/context";
import { getTourSets } from "~/data";
import type { MetaFunction, LoaderFunctionArgs } from "react-router";
import type { TTourSet } from "~/types";

export const meta: MetaFunction = () => {
  return [
    { title: "Open Tour" },
    { name: "description", content: "Page showing all published tours." },
  ];
};

export const loader = async ({ context }: LoaderFunctionArgs) => {
  const tenant = context.get(tenantContext);
  const request = context.get(requestContext);
  if (tenant && tenant !== "otb") {
    if (request.host.includes(tenant)) {
      throw redirect("/tours");
    } else {
      throw redirect(`${request.protocol}://${tenant}.${request.host}/tours`);
    }
  }
  const tourSets = await getTourSets();
  return { tourSets, request, tenant };
};

export default function Index() {
  const { tourSets, request } = useLoaderData<typeof loader>();
  return (
    <div>
      <ClientOnly>
        <AllToursMap
          tours={tourSets
            .map((ts: TTourSet) =>
              ts.mapable_tours.map((tour) => {
                return { ...tour, tenant: ts.subdir };
              }),
            )
            .flat()}
          request={request}
        />
      </ClientOnly>
      <div className="m-8">
        <ul className="grid grid-cols-1 w-full md:px-16">
          {tourSets?.map((ts: TTourSet) => {
            return (
              <li key={ts.subdir} className="grid mb-8">
                <a
                  className="bg-gray-300 text-xl px-2 py-1"
                  href={`${request.protocol}://${ts.subdir}.${request.host}`}
                >
                  {ts.name}
                </a>
                <ul className="list-disc">
                  {ts.published_tours.map((tour) => {
                    if (tour) {
                      return (
                        <li key={tour.slug} className="ml-8 text-small">
                          <a
                            href={`${request.protocol}://${ts.subdir}.${request.host}/${tour.slug}`}
                          >
                            {tour.title}
                          </a>
                        </li>
                      );
                    }
                  })}
                </ul>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
