import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";

type TWindowSize = {
  width: number | undefined;
  height: number | undefined;
};

type TViewportSize = {
  windowSize: TWindowSize;
  documentSize: TWindowSize;
  mainContentSize: TWindowSize & { topOffset: number | undefined };
};

const calcDocumentHeight = () => {
  const bodyEl = document.body;
  const htmlEl = document.documentElement;

  return Math.max(
    bodyEl.scrollHeight,
    bodyEl.offsetHeight,
    htmlEl.clientHeight,
    htmlEl.scrollHeight,
    htmlEl.offsetHeight
  );
};

const calcDocumentWidth = () => {
  const bodyEl = document.body;
  const htmlEl = document.documentElement;

  return Math.max(
    bodyEl.scrollWidth,
    bodyEl.offsetWidth,
    htmlEl.clientWidth,
    htmlEl.scrollWidth,
    htmlEl.offsetWidth
  );
};

export function useResizeObserver() {
  const [viewportSize, setViewportSize] = useState<TViewportSize>({
    windowSize: { width: undefined, height: undefined },
    documentSize: { width: undefined, height: undefined },
    mainContentSize: { width: undefined, height: undefined, topOffset: undefined },
  });

  useEffect(() => {
    function handleResize() {
      const mainContentElement = document.getElementById("main-content");
      setViewportSize({
        windowSize: {
          width: window.innerWidth,
          height: window.innerHeight,
        },
        documentSize: {
          width: calcDocumentWidth(),
          height: calcDocumentHeight(),
        },
        mainContentSize: {
          width: mainContentElement?.clientWidth,
          height: mainContentElement?.clientHeight,
          topOffset:
            window.scrollY +
            (mainContentElement?.getBoundingClientRect().top || 0),
        },
      });
    }

    handleResize();

    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });

    resizeObserver.observe(document.body);
    resizeObserver.observe(document.documentElement);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return viewportSize;
}

type TDeviceContext = {
  isMobile: boolean | undefined;
  isDesktop: boolean | undefined;
};

const DeviceContext = createContext<TDeviceContext>({
  isMobile: undefined,
  isDesktop: undefined,
});

export function DeviceContextProvider({ children }: { children: ReactNode }) {
  const { windowSize } = useResizeObserver();
  const [isMobile, setIsMobile] = useState<boolean | undefined>(undefined);
  const [isDesktop, setIsDesktop] = useState<boolean | undefined>(undefined);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!windowSize.width || !isHydrated) return;

    const MOBILE_BREAKPOINT = 768;

    if (windowSize.width < MOBILE_BREAKPOINT) {
      setIsMobile(true);
      setIsDesktop(false);
    } else {
      setIsMobile(false);
      setIsDesktop(true);
    }
  }, [windowSize, isHydrated]);

  const value: TDeviceContext =
    !isHydrated || isMobile === undefined
      ? { isMobile: undefined, isDesktop: undefined }
      : { isMobile, isDesktop };

  return (
    <DeviceContext.Provider value={value}>{children}</DeviceContext.Provider>
  );
}

export function useDeviceContext() {
  return useContext(DeviceContext);
}
