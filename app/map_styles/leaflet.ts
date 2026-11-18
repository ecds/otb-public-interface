import type Leaflet from "leaflet";
import type { TTour } from "~/types";

// Same gray as the MapLibre blank style.
export const BLANK_BACKGROUND = "#9a9a9a";

const osm = {
  url: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
  options: {
    maxZoom: 19,
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  },
};

const tiles: Record<
  TTour["map_type"],
  { url: string; options: Leaflet.TileLayerOptions }
> = {
  road: osm,
  satellite: {
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    options: {
      maxZoom: 19,
      attribution:
        "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",
    },
  },
  hybrid: {
    url: "https://tiles.stadiamaps.com/tiles/alidade_satellite/{z}/{x}/{y}{r}.jpg",
    options: {
      maxZoom: 20,
      attribution:
        '&copy; CNES, Distribution Airbus DS, &copy; Airbus DS, &copy; PlanetObserver (Contains Copernicus Data) | &copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    },
  },
};

// The Leaflet counterpart of styleFor: tiles for the tour's map type, or a
// plain gray background for a blank map. Without a tour, the road map.
export const addBasemap = (
  L: typeof Leaflet,
  map: Leaflet.Map,
  tour?: Pick<TTour, "map_type" | "blank_map">,
) => {
  if (tour?.blank_map) {
    map.getContainer().style.background = BLANK_BACKGROUND;
    return;
  }
  const { url, options } = tiles[tour?.map_type ?? "road"] ?? osm;
  L.tileLayer(url, options).addTo(map);
};
