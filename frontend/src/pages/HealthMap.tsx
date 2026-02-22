import { useEffect, useRef, useState } from "react";
import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import GeoJSONLayer from "@arcgis/core/layers/GeoJSONLayer";
import UniqueValueRenderer from "@arcgis/core/renderers/UniqueValueRenderer";
import SimpleFillSymbol from "@arcgis/core/symbols/SimpleFillSymbol";
import "@arcgis/core/assets/esri/themes/light/main.css";

import {
  DISTRICTS,
  STATUS_CONFIG,
  coverageScore,
  scoreToColor,
  getDistrict,
  type DistrictData,
} from "../data/healthCoverageData";
import districtsGeoJSON from "../data/richmondDistricts.geojson?url";

const LEGEND_ITEMS = [
  { label: "Well covered (75%+)", color: "#16a34a" },
  { label: "Moderate (50-74%)", color: "#ca8a04" },
  { label: "Low (25-49%)", color: "#ea580c" },
  { label: "Critical (<25%)", color: "#dc2626" },
];

const RICHMOND_CENTER = { longitude: -77.436, latitude: 37.5407 };

export default function HealthMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<MapView | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<DistrictData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!mapRef.current) return;

    const map = new Map({ basemap: "osm" });

    const view = new MapView({
      container: mapRef.current,
      map,
      center: [RICHMOND_CENTER.longitude, RICHMOND_CENTER.latitude],
      zoom: 12,
      ui: { components: ["zoom"] },
    });
    viewRef.current = view;

    // Build unique-value infos from our district data
    const uniqueValueInfos = DISTRICTS.map((d) => ({
      value: d.district,
      symbol: new SimpleFillSymbol({
        color: scoreToColor(coverageScore(d.sectors)) + "99",
        outline: { color: "#ffffff", width: 2 },
      }),
    }));

    const districtLayer = new GeoJSONLayer({
      url: districtsGeoJSON,
      outFields: ["district"],
      renderer: new UniqueValueRenderer({
        field: "district",
        uniqueValueInfos,
        defaultSymbol: new SimpleFillSymbol({
          color: "#9ca3af66",
          outline: { color: "#ffffff", width: 1 },
        }),
      }),
    });

    map.add(districtLayer);

    view.when(() => setLoading(false));

    // Click handler
    const clickHandle = view.on("click", async (event) => {
      const response = await view.hitTest(event);
      const result = response.results.find(
        (r) => r.type === "graphic" && r.graphic.layer === districtLayer
      );
      if (result && result.type === "graphic") {
        const distNum = result.graphic.attributes.district;
        const district = getDistrict(Number(distNum));
        setSelectedDistrict(district ?? null);
      } else {
        setSelectedDistrict(null);
      }
    });

    return () => {
      clickHandle.remove();
      view.destroy();
    };
  }, []);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
        <h1 style={{ fontSize: "1.5rem" }}>Richmond Health Coverage Map</h1>
      </div>
      <p style={{ color: "#6b7280", fontSize: "0.9rem", marginBottom: "0.75rem" }}>
        Click a district to see health sector coverage details.
      </p>

      <div className="health-map-legend">
        {LEGEND_ITEMS.map((item) => (
          <span key={item.label}>
            <span className="legend-swatch" style={{ background: item.color }} />
            {item.label}
          </span>
        ))}
      </div>

      <div className="health-map-layout">
        <div className="health-map-container">
          {loading && (
            <p style={{ padding: "1rem", color: "#6b7280" }}>Loading map...</p>
          )}
          <div ref={mapRef} className="health-map-view" />
        </div>

        {selectedDistrict && (
          <div className="health-map-detail">
            <h2>{selectedDistrict.name}</h2>
            <p className="detail-score">
              Overall coverage:{" "}
              {Math.round(coverageScore(selectedDistrict.sectors) * 100)}%
            </p>
            <ul className="health-sector-list">
              {selectedDistrict.sectors.map((sector) => {
                const cfg = STATUS_CONFIG[sector.status];
                return (
                  <li key={sector.name} className="health-sector-item">
                    <span>{sector.name}</span>
                    <span
                      className="sector-badge"
                      style={{ color: cfg.color, background: cfg.bg }}
                    >
                      {cfg.icon} {cfg.label}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
