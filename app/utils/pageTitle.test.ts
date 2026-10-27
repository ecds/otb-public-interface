import { describe, expect, it } from "vitest";
import { pageTitle } from "./pageTitle";

describe("pageTitle", () => {
  it("joins the parts, most specific first", () => {
    expect(pageTitle("Map", "Old Church", "Town Tour")).toBe(
      "Map – Old Church – Town Tour",
    );
  });

  it("leaves out missing parts", () => {
    expect(pageTitle(undefined, "Town Tour", "")).toBe("Town Tour");
  });
});
