import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ConsentSheet from "./ConsentSheet";
import { resetPreferencesStore } from "~/hooks/usePreferences";

const mockStorage = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => { store[key] = value; },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; },
  };
})();

Object.defineProperty(globalThis, "localStorage", { value: mockStorage });

beforeEach(() => {
  mockStorage.clear();
  resetPreferencesStore();
});

const seed = (prefs: string[]) => {
  mockStorage.setItem("OpenTour", JSON.stringify(prefs));
  resetPreferencesStore();
};

const setup = (props: Partial<Parameters<typeof ConsentSheet>[0]> = {}) => {
  const onDone = vi.fn();
  const onManage = vi.fn();
  render(
    <ConsentSheet open={true} onDone={onDone} onManage={onManage} {...props} />,
  );
  return { onDone, onManage };
};

describe("ConsentSheet", () => {
  it("renders nothing when open is false", () => {
    render(<ConsentSheet open={false} onDone={vi.fn()} onManage={vi.fn()} />);
    expect(screen.queryByText("Cookie preferences")).not.toBeInTheDocument();
  });

  it("renders the sheet when open is true", () => {
    setup();
    expect(screen.getByText("Cookie preferences")).toBeInTheDocument();
    expect(screen.getByText("Accept all")).toBeInTheDocument();
    expect(screen.getByText("Essential only")).toBeInTheDocument();
    expect(screen.getByText("Manage preferences")).toBeInTheDocument();
  });

  it("accept all saves all preferences and calls onDone", async () => {
    const { onDone } = setup();
    await userEvent.click(screen.getByText("Accept all"));
    const stored = JSON.parse(mockStorage.getItem("OpenTour")!);
    expect(stored).toContain("gMaps");
    expect(stored).toContain("analyticsAllowed");
    expect(stored).toContain("thirdPartyEmbeds");
    expect(onDone).toHaveBeenCalledOnce();
  });

  it("essential only saves only functional and calls onDone", async () => {
    const { onDone } = setup();
    await userEvent.click(screen.getByText("Essential only"));
    const stored = JSON.parse(mockStorage.getItem("OpenTour")!);
    expect(stored).toEqual(["functional"]);
    expect(onDone).toHaveBeenCalledOnce();
  });

  it("manage preferences calls onManage", async () => {
    const { onManage } = setup();
    await userEvent.click(screen.getByText("Manage preferences"));
    expect(onManage).toHaveBeenCalledOnce();
  });
});
