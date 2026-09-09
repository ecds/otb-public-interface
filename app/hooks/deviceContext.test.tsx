import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { DeviceContextProvider, useDeviceContext } from "./deviceContext";
import type { ReactNode } from "react";

const wrapper = ({ children }: { children: ReactNode }) => (
  <DeviceContextProvider>{children}</DeviceContextProvider>
);

let resizeObserverCallback: ResizeObserverCallback | undefined;
const observe = vi.fn();
const disconnect = vi.fn();

class MockResizeObserver implements ResizeObserver {
  constructor(cb: ResizeObserverCallback) {
    resizeObserverCallback = cb;
  }
  observe = observe;
  disconnect = disconnect;
  unobserve = vi.fn();
}

const setWindowWidth = (width: number) => {
  Object.defineProperty(window, "innerWidth", {
    value: width,
    writable: true,
    configurable: true,
  });
};

const fireResize = () => {
  act(() => {
    resizeObserverCallback!([], {} as ResizeObserver);
  });
};

beforeEach(() => {
  vi.stubGlobal("ResizeObserver", MockResizeObserver);
  resizeObserverCallback = undefined;
  observe.mockClear();
  disconnect.mockClear();
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("DeviceContextProvider — mobile breakpoint", () => {
  it("sets isMobile=true for widths below 768", () => {
    setWindowWidth(375);
    const { result } = renderHook(() => useDeviceContext(), { wrapper });
    expect(result.current.isMobile).toBe(true);
    expect(result.current.isDesktop).toBe(false);
  });

  it("sets isMobile=true at 767", () => {
    setWindowWidth(767);
    const { result } = renderHook(() => useDeviceContext(), { wrapper });
    expect(result.current.isMobile).toBe(true);
    expect(result.current.isDesktop).toBe(false);
  });
});

describe("DeviceContextProvider — desktop breakpoint", () => {
  it("sets isDesktop=true at 768", () => {
    setWindowWidth(768);
    const { result } = renderHook(() => useDeviceContext(), { wrapper });
    expect(result.current.isMobile).toBe(false);
    expect(result.current.isDesktop).toBe(true);
  });

  it("sets isDesktop=true at 1440", () => {
    setWindowWidth(1440);
    const { result } = renderHook(() => useDeviceContext(), { wrapper });
    expect(result.current.isMobile).toBe(false);
    expect(result.current.isDesktop).toBe(true);
  });
});

describe("DeviceContextProvider — ResizeObserver lifecycle", () => {
  it("observes document.body and documentElement", () => {
    setWindowWidth(375);
    renderHook(() => useDeviceContext(), { wrapper });
    expect(observe).toHaveBeenCalledWith(document.body);
    expect(observe).toHaveBeenCalledWith(document.documentElement);
  });

  it("disconnects on unmount", () => {
    setWindowWidth(375);
    const { unmount } = renderHook(() => useDeviceContext(), { wrapper });
    unmount();
    expect(disconnect).toHaveBeenCalledOnce();
  });

  it("updates when the window resizes from mobile to desktop", () => {
    setWindowWidth(375);
    const { result } = renderHook(() => useDeviceContext(), { wrapper });
    expect(result.current.isMobile).toBe(true);

    setWindowWidth(1024);
    fireResize();

    expect(result.current.isMobile).toBe(false);
    expect(result.current.isDesktop).toBe(true);
  });

  it("updates when the window resizes from desktop to mobile", () => {
    setWindowWidth(1024);
    const { result } = renderHook(() => useDeviceContext(), { wrapper });
    expect(result.current.isDesktop).toBe(true);

    setWindowWidth(375);
    fireResize();

    expect(result.current.isMobile).toBe(true);
    expect(result.current.isDesktop).toBe(false);
  });
});
