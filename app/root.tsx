import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "react-router";
import { useMemo } from "react";
import TourSiteContext from "./contexts/tourSiteContext";
import { requestContext, tenantContext } from "./context";
import { getTourSet } from "./data";
import { DeviceContextProvider, useDeviceContext } from "./hooks/deviceContext";
import styles from "./index.css?url";
import type {
  MetaFunction,
  LinksFunction,
  LoaderFunctionArgs,
} from "react-router";

export const links: LinksFunction = () => [{ rel: "stylesheet", href: styles }];

export const meta: MetaFunction = () => {
  return [
    { charset: "utf-8" },
    { title: "OpenTourBuilder" },
    { name: "viewport", content: "width=device-width,initial-scale=1" },
  ];
};

export const loader = async ({ context }: LoaderFunctionArgs) => {
  const tenant = context.get(tenantContext);
  const request = context.get(requestContext);
  if (tenant && tenant !== "otb") {
    const tourSet = await getTourSet(tenant);
    return { tourSet, request };
  }
  return { tourSet: null, request, tenant };
};

function AppShell() {
  const { isMobile } = useDeviceContext();

  return (
    <body className="">
      <Outlet />
      {isMobile && <ScrollRestoration />}
      <Scripts />
    </body>
  );
}

export default function App() {
  const { tourSet } = useLoaderData<typeof loader>();

  const tourSiteContextValue = useMemo(
    () => ({ currentSite: tourSet, tenant: tourSet?.attributes.subdir }),
    [tourSet],
  );

  return (
    <DeviceContextProvider>
      <TourSiteContext.Provider value={tourSiteContextValue}>
        <html lang="en">
          <head>
            <Links />
            <meta charSet="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <Meta />
          </head>
          <AppShell />
        </html>
      </TourSiteContext.Provider>
    </DeviceContextProvider>
  );
}
