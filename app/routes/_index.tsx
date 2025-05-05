import type { MetaFunction } from "@remix-run/node";
import { getTourSets } from "~/data";
import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import AllToursMap from "~/components/index/AllToursMap.client";
import { ClientOnly } from "remix-utils/client-only";
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
  if (tenant) {
    if (request.host.includes(tenant)) {
      throw redirect("/tours");
    } else {
      throw redirect(`${request.protocol}://${tenant}.${request.host}/tours`);
    }
  }
  const tourSets = await getTourSets();
  return json({ tourSets, request, tenant });
};

export default function Index() {
  const { tourSets, request } = useLoaderData<typeof loader>();
  return (
    <div>
      <ClientOnly>
        {() => (
          <AllToursMap
            tours={tourSets
              .map((ts: TTourSet) => ts.attributes.mapable_tours)
              .flat()}
          />
        )}
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
