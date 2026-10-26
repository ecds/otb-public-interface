import { useState } from "react";

// An element React doesn't place in the page, for map libraries that move
// the elements they're given (markers, popups) into their own containers.
// Render into it with createPortal. Handing a library an element React
// rendered in place breaks React's next re-render, since it's no longer
// where React left it.
export const useDetachedElement = (className = "", id?: string) => {
  const [element] = useState(() => {
    const el = document.createElement("div");
    el.className = className;
    if (id) el.id = id;
    return el;
  });
  return element;
};
