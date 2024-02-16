import { useState } from "react";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import { json } from "@remix-run/node";
import TourSiteContext from "./contexts/tourSiteContext";
import { getTourSet } from "./data";
import type { LinksFunction } from "@remix-run/node";
import type { TLoaderContext } from "./types/TLoaderContext";
import type { TTourSet } from "./types/TTourSet";
import type { TTour } from "./types/TTour";
import type { TStop } from "./types/TStop";
import type { TTourFlatPage } from "./types/TTourFlatPage";

import styles from "./app.css";

interface LoaderProps {
  context: TLoaderContext;
}

export const links: LinksFunction = () => [{ rel: "stylesheet", href: styles }];

export const loader = async ({ context }: LoaderProps) => {
  const { tenant } = context;
  if (tenant) {
    const tourSet = await getTourSet(tenant);
    return json({ tourSet });
  }
  return { tourSet: null };
};

export default function App() {
  const { tourSet } = useLoaderData<typeof loader>();
  const [currentSite, setCurrentSite] = useState<TTourSet | undefined>(tourSet);
  const [currentTour, setCurrentTour] = useState<TTour | undefined>(undefined);
  const [currentFlatPage, setCurrentFlatPage] = useState<
    TTourFlatPage | string | undefined
  >(undefined);
  const [currentStop, setCurrentStop] = useState<TStop | undefined>(undefined);

  return (
    <TourSiteContext.Provider
      value={{
        currentSite,
        setCurrentSite,
        currentTour,
        setCurrentTour,
        currentStop,
        setCurrentStop,
        currentFlatPage,
        setCurrentFlatPage,
      }}
    >
      <html lang="en">
        <head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <Meta />
          <Links />
        </head>
        <body>
          <Outlet />
          <ScrollRestoration />
          <Scripts />
          <LiveReload />
        </body>
      </html>
    </TourSiteContext.Provider>
  );
}
