"use client";

import { useState } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import Navigation from "@/components/Navigation";

const geoUrl =
  "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

type Projection =
  | "geoEqualEarth"
  | "geoMercator"
  | "geoNaturalEarth1"
  | "geoOrthographic"
  | "geoStereographic";

const projections: Array<{
  name: string;
  value: Projection;
  description: string;
  config?: {
    rotate?: [number, number, number];
    scale?: number;
  };
}> = [
  {
    name: "Equal Earth",
    value: "geoEqualEarth",
    description:
      "Equal-area projection that maintains relative sizes. Good for thematic maps.",
  },
  {
    name: "Mercator",
    value: "geoMercator",
    description:
      "Classic web map projection. Preserves angles but distorts sizes near poles.",
    config: { scale: 100 },
  },
  {
    name: "Natural Earth",
    value: "geoNaturalEarth1",
    description:
      "Compromise projection balancing shape and area distortion. Visually appealing.",
  },
  {
    name: "Orthographic",
    value: "geoOrthographic",
    description:
      "Globe-like view showing one hemisphere. Great for showing Earth from space.",
    config: { rotate: [0, 0, 0], scale: 200 },
  },
  {
    name: "Stereographic",
    value: "geoStereographic",
    description: "Conformal projection often used for polar regions.",
    config: { rotate: [0, 0, 0], scale: 200 },
  },
];

export default function ProjectionsPage() {
  const [selectedProjection, setSelectedProjection] = useState<Projection>("geoEqualEarth");
  const [rotation, setRotation] = useState<[number, number, number]>([0, 0, 0]);

  const currentProjection = projections.find((p) => p.value === selectedProjection);

  return (
    <div className="container">
      <Navigation />

      <div className="demo-section">
        <h2>Map Projections</h2>
        <p>
          Map projections transform the 3D surface of the Earth onto a 2D plane.
          Different projections have different properties and use cases. Experiment
          with various projections to see how they affect the map appearance.
        </p>

        <div className="controls">
          <label style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <strong>Select Projection:</strong>
            <select
              value={selectedProjection}
              onChange={(e) => setSelectedProjection(e.target.value as Projection)}
              style={{
                padding: "8px 12px",
                fontSize: "14px",
                borderRadius: "4px",
                border: "1px solid #ddd",
              }}
            >
              {projections.map((proj) => (
                <option key={proj.value} value={proj.value}>
                  {proj.name}
                </option>
              ))}
            </select>
          </label>
        </div>

        {currentProjection && (
          <div
            style={{
              padding: "12px",
              background: "#f9f9f9",
              borderRadius: "4px",
              marginBottom: "20px",
              borderLeft: "4px solid #2196F3",
            }}
          >
            <strong>{currentProjection.name}:</strong> {currentProjection.description}
          </div>
        )}

        {(selectedProjection === "geoOrthographic" ||
          selectedProjection === "geoStereographic") && (
          <div className="controls">
            <label style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <strong>Rotate:</strong>
              <input
                type="range"
                min="-180"
                max="180"
                value={rotation[0]}
                onChange={(e) =>
                  setRotation([Number(e.target.value), rotation[1], rotation[2]])
                }
                style={{ width: "200px" }}
              />
              <span>{rotation[0]}°</span>
            </label>
          </div>
        )}

        <div className="map-container">
          <ComposableMap
            projection={selectedProjection}
            width={800}
            height={400}
            projectionConfig={{
              ...(currentProjection?.config || {}),
              ...(selectedProjection === "geoOrthographic" ||
              selectedProjection === "geoStereographic"
                ? { rotate: rotation }
                : {}),
            }}
          >
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map((geo) => (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill="#EAEAEC"
                    stroke="#D6D6DA"
                    strokeWidth={0.5}
                    style={{
                      hover: {
                        fill: "#F53",
                        outline: "none",
                      },
                    }}
                  />
                ))
              }
            </Geographies>
          </ComposableMap>
        </div>

        <div className="info-panel" style={{ marginTop: "20px" }}>
          <h3>Common Projections Comparison</h3>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginTop: "10px",
            }}
          >
            <thead>
              <tr style={{ background: "#f5f5f5" }}>
                <th style={{ padding: "10px", textAlign: "left", borderBottom: "2px solid #ddd" }}>
                  Projection
                </th>
                <th style={{ padding: "10px", textAlign: "left", borderBottom: "2px solid #ddd" }}>
                  Best For
                </th>
                <th style={{ padding: "10px", textAlign: "left", borderBottom: "2px solid #ddd" }}>
                  Properties
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: "10px", borderBottom: "1px solid #eee" }}>
                  <strong>Equal Earth</strong>
                </td>
                <td style={{ padding: "10px", borderBottom: "1px solid #eee" }}>
                  Statistical maps, choropleth
                </td>
                <td style={{ padding: "10px", borderBottom: "1px solid #eee" }}>
                  Equal-area, moderate distortion
                </td>
              </tr>
              <tr>
                <td style={{ padding: "10px", borderBottom: "1px solid #eee" }}>
                  <strong>Mercator</strong>
                </td>
                <td style={{ padding: "10px", borderBottom: "1px solid #eee" }}>
                  Navigation, web maps
                </td>
                <td style={{ padding: "10px", borderBottom: "1px solid #eee" }}>
                  Conformal, large polar distortion
                </td>
              </tr>
              <tr>
                <td style={{ padding: "10px", borderBottom: "1px solid #eee" }}>
                  <strong>Natural Earth</strong>
                </td>
                <td style={{ padding: "10px", borderBottom: "1px solid #eee" }}>
                  General reference maps
                </td>
                <td style={{ padding: "10px", borderBottom: "1px solid #eee" }}>
                  Compromise, visually appealing
                </td>
              </tr>
              <tr>
                <td style={{ padding: "10px", borderBottom: "1px solid #eee" }}>
                  <strong>Orthographic</strong>
                </td>
                <td style={{ padding: "10px", borderBottom: "1px solid #eee" }}>
                  Globe view, presentations
                </td>
                <td style={{ padding: "10px", borderBottom: "1px solid #eee" }}>
                  Hemisphere view, perspective
                </td>
              </tr>
              <tr>
                <td style={{ padding: "10px", borderBottom: "1px solid #eee" }}>
                  <strong>Stereographic</strong>
                </td>
                <td style={{ padding: "10px", borderBottom: "1px solid #eee" }}>
                  Polar regions
                </td>
                <td style={{ padding: "10px", borderBottom: "1px solid #eee" }}>
                  Conformal, circular
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="info-panel" style={{ marginTop: "20px" }}>
          <h3>Code Snippet</h3>
          <pre
            style={{
              background: "#1e1e1e",
              color: "#d4d4d4",
              padding: "15px",
              borderRadius: "4px",
              overflow: "auto",
              fontSize: "13px",
            }}
          >
            {`<ComposableMap
  projection="geoEqualEarth"  // or "geoMercator", "geoOrthographic", etc.
  projectionConfig={{
    rotate: [0, 0, 0],  // [lambda, phi, gamma]
    scale: 147,          // zoom level
  }}
>
  <Geographies geography={geoUrl}>
    {/* ... */}
  </Geographies>
</ComposableMap>`}
          </pre>
        </div>
      </div>
    </div>
  );
}

