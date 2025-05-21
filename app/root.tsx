import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "react-router";
import TourSiteContext from "./contexts/tourSiteContext";
import { getTourSet } from "./data";
import type { MetaFunction, LinksFunction } from "react-router";
import type { TLoaderContext } from "./types/TLoaderContext";

import styles from "./index.css?url";
console.log("🚀 ~ styles:", styles);
import { useDeviceContext } from "./hooks";

interface LoaderProps {
  context: TLoaderContext;
}
export const links: LinksFunction = () => [{ rel: "stylesheet", href: styles }];

export const meta: MetaFunction = () => {
  return [
    { charset: "utf-8" },
    { title: "OpenTourBuilder" },
    { name: "viewport", content: "width=device-width,initial-scale=1" },
  ];
};

export const loader = async ({ context }: LoaderProps) => {
  const { tenant, request } = context;
  if (tenant) {
    const tourSet = await getTourSet(tenant);
    return { tourSet, request };
  }
  return { tourSet: null, request, tenant };
};

export default function App() {
  const { tourSet } = useLoaderData<typeof loader>();
  const { isMobile, isDesktop } = useDeviceContext();

  return (
    <TourSiteContext.Provider
      value={{
        currentSite: tourSet,
        tenant: tourSet?.attributes.subdir,
      }}
    >
      <html lang="en">
        <head>
          <Links />
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <Meta />
        </head>
        <body>
          {(isMobile || isDesktop) && <Outlet />}
          <ScrollRestoration />
          <Scripts />
        </body>
      </html>
    </TourSiteContext.Provider>
  );
}
