// People often look for a site's admin at https://<tenant>.opentour.site/admin,
// but the admin lives on the main domain at /admin/<tenant>. Plain JS so the
// Express server (server.js, outside the Vite build) can use it too.

/**
 * Where to send a request for /admin on a tenant's site, or undefined when
 * it isn't one (no tenant, or not an /admin path).
 *
 * @param {{ tenant: string | undefined, host: string, url: string, protocol: string }} request
 *   url is the path and query, e.g. "/admin/tours/12?x=1".
 * @returns {string | undefined}
 */
export const adminRedirectUrl = ({ tenant, host, url, protocol }) => {
  const match = /^\/admin(?:\/([^?#]*))?(\?[^#]*)?(?:#.*)?$/.exec(url);
  if (!tenant || !match) return undefined;

  // Drop only the tenant's label, so dev.opentour.site and lvh.me keep
  // pointing at the right environment.
  const [hostname, port] = host.split(":");
  const labels = hostname.split(".");
  const index = labels.indexOf(tenant);
  if (index === -1) return undefined;
  labels.splice(index, 1);
  const mainHost = [labels.join("."), port].filter(Boolean).join(":");

  const rest = (match[1] ?? "").replace(/\/+$/, "");
  const path = `/admin/${encodeURIComponent(tenant)}${rest ? `/${rest}` : ""}`;
  return `${protocol}://${mainHost}${path}${match[2] ?? ""}`;
};
