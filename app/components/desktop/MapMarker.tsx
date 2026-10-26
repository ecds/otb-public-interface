import { faCircle, faLocationPin } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as maplibregl from "maplibre-gl";
import { useCallback, useContext, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { TourContext } from "~/contexts/TourContext";
import { useDeviceContext } from "~/hooks/deviceContext";
import { useDetachedElement } from "~/hooks/useDetachedElement";
import { activateOnKeys, connectPopup, labelMarker } from "~/utils/markerA11y";
import PopUpContent from "../mobile/PopUpContent";
import type { AddLayerObject, Map, SourceSpecification } from "maplibre-gl";
import type { TTourStop } from "~/types";

interface Props {
  stop: TTourStop;
  map: Map | undefined;
  fitBounds?: boolean;
}

const MapMarker = ({ map, stop, fitBounds = true }: Props) => {
  const { currentStop, setCurrentStop, tour } = useContext(TourContext);
  const [isCurrent, setIsCurrent] = useState<boolean>(false);
  const markerElement = useDetachedElement(
    "cursor-pointer rounded-sm focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-blue-700",
  );
  const popupElement = useDetachedElement("", `${stop.slug}-popup`);
  const { isMobile } = useDeviceContext();

  useEffect(() => {
    setIsCurrent(currentStop === stop);
  }, [currentStop, stop]);

  useEffect(() => {
    if (isCurrent) markerElement.setAttribute("aria-current", "true");
    else markerElement.removeAttribute("aria-current");
  }, [isCurrent, markerElement]);

  const navigateToStop = useCallback(() => {
    if (isMobile) return;
    setCurrentStop(stop);
    document.getElementById(stop.slug)?.scrollIntoView({ behavior: "instant" });
  }, [stop, setCurrentStop, isMobile]);

  useEffect(() => {
    if (!map || stop.map_icon) return;

    const popup = new maplibregl.Popup().setDOMContent(popupElement);

    const marker = new maplibregl.Marker({
      element: markerElement,
      anchor: "bottom",
    })
      .setLngLat([stop.lng, stop.lat])
      .addTo(map);

    if (fitBounds) {
      map.fitBounds(map.getBounds().extend([stop.lng, stop.lat]), {
        padding: 50,
      });
    }

    labelMarker(
      markerElement,
      stop.position === 0 ? stop.title : `Stop ${stop.position}: ${stop.title}`,
    );

    // On mobile the popup links to the stop; on desktop the marker scrolls
    // to it, and from the keyboard moves focus there too.
    let cleanUpKeys = () => {};
    if (isMobile) {
      marker.setPopup(popup);
      cleanUpKeys = connectPopup(popup, markerElement, popupElement);
    } else {
      cleanUpKeys = activateOnKeys(markerElement, () => {
        navigateToStop();
        const section = document.getElementById(stop.slug);
        if (!section) return;
        if (!section.hasAttribute("tabindex")) section.tabIndex = -1;
        section.focus({ preventScroll: true });
      });
    }

    marker.on("click", navigateToStop);

    return () => {
      cleanUpKeys();
      marker.off("click", navigateToStop);
      marker.remove();
    };
  }, [
    stop,
    map,
    navigateToStop,
    isMobile,
    fitBounds,
    markerElement,
    popupElement,
  ]);

  useEffect(() => {
    if (!map || !stop.map_icon) return;

    const handleMouseEnter = () => {
      map.getCanvas().style.cursor = "pointer";
    };

    const handleMouseLeave = () => {
      map.getCanvas().style.cursor = "";
    };

    map.on("load", async () => {
      if (!stop.map_icon) return;
      const image = await map.loadImage(stop.map_icon);

      const id = `${stop.slug}-icon`;
      const imageId = `${id}-image`;

      const iconSource: SourceSpecification = {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: [
            {
              type: "Feature",
              geometry: {
                type: "Point",
                coordinates: [stop.lng, stop.lat],
              },
              properties: {},
            },
          ],
        },
      };

      const iconLayer: AddLayerObject = {
        id,
        type: "symbol",
        source: id,
        layout: {
          "icon-image": imageId,
          "icon-size": 0.5,
        },
      };

      map.on("click", iconLayer.id, navigateToStop);
      map.on("mousemove", iconLayer.id, handleMouseEnter);
      map.on("mouseleave", iconLayer.id, handleMouseLeave);

      if (!map.getImage(imageId)) map.addImage(imageId, image.data);

      if (!map.getSource(id)) {
        map.addSource(id, iconSource);
        map.addLayer(iconLayer);
      }

      return () => {
        map.off("click", iconLayer.id, navigateToStop);
        map.off("mousemove", iconLayer.id, handleMouseEnter);
        map.off("mouseleave", iconLayer.id, handleMouseLeave);
        if (map.getLayer(id)) map.removeLayer(id);
        if (map.getSource(id)) map.removeSource(id);
      };
    });
  }, [map, stop, navigateToStop]);

  if (!stop.map_icon) {
    return (
      <>
        {createPortal(
          <>
            <FontAwesomeIcon
              icon={faLocationPin}
              style={{
                color: stop.icon_color ?? tour?.icon_color ?? "#d32f2f",
                width: isCurrent ? "48px" : "32px",
                height: isCurrent ? "48px" : "32px",
                cursor: "pointer",
                filter: "drop-shadow(2px 4px 6px rgba(0, 0, 0, 0.4))",
              }}
            />
            <span
              className={`fa-stack-1x fa-inverse text-center ${
                isCurrent ? "text-xl" : "text-base"
              }`}
            >
              {stop.position === 0 ? (
                <FontAwesomeIcon
                  icon={faCircle}
                  className="text-xs text-black/35"
                />
              ) : (
                <>{stop.position}</>
              )}
            </span>
          </>,
          markerElement,
        )}
        {createPortal(<PopUpContent stop={stop} />, popupElement)}
      </>
    );
  }

  return <></>;
};

export default MapMarker;
