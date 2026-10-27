import type { Popup } from "maplibre-gl";

// Names a custom MapLibre marker and makes it a button. MapLibre gives a
// marker with a popup a tabindex and opens the popup on Enter or Space, but
// leaves custom marker elements without a role or name.
export const labelMarker = (element: HTMLElement, label: string) => {
  element.setAttribute("role", "button");
  element.setAttribute("aria-label", label);
};

// Lets the marker's popup close with Escape, says whether it's open, and
// puts focus back on the marker when the popup closes from inside (Escape
// or its close button), not when someone clicks elsewhere on the map.
export const connectPopup = (
  popup: Popup,
  markerElement: HTMLElement,
  popupElement: HTMLElement,
) => {
  markerElement.setAttribute("aria-expanded", "false");

  const handleOpen = () => markerElement.setAttribute("aria-expanded", "true");
  const handleClose = () => {
    markerElement.setAttribute("aria-expanded", "false");
    const focused = document.activeElement;
    if (!focused || focused === document.body || popupElement.contains(focused))
      markerElement.focus();
  };
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Escape") popup.remove();
  };

  popup.on("open", handleOpen);
  popup.on("close", handleClose);
  popupElement.addEventListener("keydown", handleKeyDown);

  return () => {
    popup.off("open", handleOpen);
    popup.off("close", handleClose);
    popupElement.removeEventListener("keydown", handleKeyDown);
  };
};

// For a marker without a popup: focusable, and Enter or Space act like a
// click.
export const activateOnKeys = (
  element: HTMLElement,
  onActivate: () => void,
) => {
  element.tabIndex = 0;
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    // Space would otherwise scroll the page.
    event.preventDefault();
    onActivate();
  };
  element.addEventListener("keydown", handleKeyDown);
  return () => element.removeEventListener("keydown", handleKeyDown);
};
