import type { MetaFunction } from "@remix-run/node";
import { getTourSets } from "~/data";
import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import AllToursMap from "~/components/index/AllToursMap";
import type { TTourSet } from "~/types/TTourSet";
import type { TLoaderContext } from "~/types/TLoaderContext";

export const meta: MetaFunction = () => {
  return [
    { title: "Open Tour" },
    { name: "description", content: "Page showing all published tours." },
  ];
};

export const loader = async ({ context }: { context: TLoaderContext }) => {
  console.log("🚀 ~ loader ~ context:", context);
  const { tenant, request } = context;
  if (tenant) {
    throw redirect(
      `${request.protocol}://${tenant}.${request.host}/tours`,
      302
    );
  }
  const tourSets = await getTourSets();
  return json({ tourSets, request, tenant });
};

export default function Index() {
  const { tourSets, request } = useLoaderData<typeof loader>();
  return (
    <div>
      <AllToursMap
        tours={tourSets
          .map((ts: TTourSet) => ts.attributes.mapable_tours)
          .flat()}
      />
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
