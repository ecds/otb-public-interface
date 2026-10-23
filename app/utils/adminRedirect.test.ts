import { describe, it, expect } from "vitest";
import { adminRedirectUrl } from "./adminRedirect";

const redirect = (
  url: string,
  host = "some-tenant.opentour.site",
  tenant: string | undefined = "some-tenant",
) => adminRedirectUrl({ tenant, host, url, protocol: "https" });

describe("adminRedirectUrl", () => {
  it("sends a tenant's /admin to its admin on the main domain", () => {
    expect(redirect("/admin")).toBe("https://opentour.site/admin/some-tenant");
    expect(redirect("/admin/")).toBe("https://opentour.site/admin/some-tenant");
  });

  it("keeps the rest of the path and the query", () => {
    expect(redirect("/admin/tours/12?tab=map")).toBe(
      "https://opentour.site/admin/some-tenant/tours/12?tab=map",
    );
  });

  it("stays in the same environment", () => {
    expect(redirect("/admin", "some-tenant.dev.opentour.site")).toBe(
      "https://dev.opentour.site/admin/some-tenant",
    );
    expect(redirect("/admin", "some-tenant.lvh.me:4200")).toBe(
      "https://lvh.me:4200/admin/some-tenant",
    );
  });

  it("leaves other paths and the main domain alone", () => {
    expect(redirect("/administration")).toBeUndefined();
    expect(redirect("/my-tour/admin")).toBeUndefined();
    expect(redirect("/admin", "opentour.site", undefined)).toBeUndefined();
  });
});
