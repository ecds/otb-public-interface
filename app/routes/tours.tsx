import { getTours } from "~/data";
import { json, redirect } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import DesktopNavbar from "~/components/desktop/DesktopNavbar";
import type { TTour } from "~/types/TTour";
import type { TLoaderContext } from "~/types/TLoaderContext";
import type { ClientLoaderFunctionArgs } from "@remix-run/react";

// interface ToursProps {

// }
export const loader = async ({ context }: { context: TLoaderContext }) => {
  const { tenant } = context;
  if (!tenant) {
    throw redirect(`http://lvh.me:4200`, 302);
  }
  const tours: TTour[] = await getTours(tenant);
  return json({ tours });
};

export const clientLoader = async ({
  request,
  params,
  serverLoader,
}: ClientLoaderFunctionArgs) => {
  console.log(
    "🚀 ~ clientLoader ~ request, params, serverLoader:",
    request,
    params,
    serverLoader()
  );
  const tenant = "battle-of-atlanta";
  // if (!tenant) {
  //   throw redirect(`http://${process.env.HOST}`, 302);
  // }
  const tours: TTour[] = await getTours(tenant);
  console.log("🚀 ~ clientLoader ~ tours:", tours);
  return { tours };
};

clientLoader.hydrate = true;

const Tours = () => {
  const { tours } = useLoaderData<typeof loader>();

  return (
    <div>
      <DesktopNavbar />
      {tours.map((tour) => {
        return (
          <p key={tour.id}>
            <Link to={`/${tour.attributes.slug}`}>{tour.attributes.title}</Link>
          </p>
        );
      })}
    </div>
  );
};

export default Tours;
