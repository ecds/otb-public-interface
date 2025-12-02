import type { MetaFunction } from "react-router";
import { getTourSets } from "~/data";
import { redirect, useLoaderData } from "react-router";
import AllToursMap from "~/components/index/AllToursMap.client";
import ClientOnly from "~/components/ClientOnly";
import type { TTourSet } from "~/types/TTourSet";
import type { TLoaderContext } from "~/types/TLoaderContext";

export const meta: MetaFunction = () => {
  return [
    { title: "Open Tour" },
    { name: "description", content: "Page showing all published tours." },
  ];
};

export const loader = async ({ context }: { context: TLoaderContext }) => {
  const { tenant, request } = context;
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
            .map((ts: TTourSet) => ts.attributes.mapable_tours)
            .flat()}
        />
      </ClientOnly>
      <div className="m-8">
        <h1 className="text-2xl">Sites</h1>
        <ul>
          {tourSets?.map((ts: TTourSet) => {
            return (
              <li key={ts.id} className="text-xl">
                <a
                  href={`${request.protocol}://${ts.attributes.subdir}.${request.host}`}
                >
                  {ts.attributes.name}
                </a>
                <ul className="list-disc">
                  {ts.attributes.mapable_tours.map((tour) => {
                    return (
                      <li key={tour.slug} className="ml-8 text-small">
                        <a
                          href={`${request.protocol}://${ts.attributes.subdir}.${request.host}/${tour.slug}`}
                        >
                          {tour.title}
                        </a>
                      </li>
                    );
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
