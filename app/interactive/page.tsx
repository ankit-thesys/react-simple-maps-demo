"use client";

import { useState } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import Navigation from "@/components/Navigation";

const geoUrl =
  "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

export default function InteractiveMapPage() {
  const [tooltip, setTooltip] = useState("");
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

  return (
    <div className="container">
      <Navigation />

      <div className="demo-section">
        <h2>Interactive Map with Hover & Click</h2>
        <p>
          This example demonstrates how to add interactivity to your maps.
          Hover over countries to see their names, and click to select them.
        </p>

        {selectedCountry && (
          <div
            style={{
              padding: "10px 15px",
              background: "#4caf50",
              color: "white",
              borderRadius: "4px",
              marginBottom: "15px",
            }}
          >
            Selected: <strong>{selectedCountry}</strong>
            <button
              onClick={() => setSelectedCountry(null)}
              style={{
                marginLeft: "15px",
                padding: "4px 12px",
                background: "white",
                color: "#4caf50",
                border: "none",
                borderRadius: "3px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              Clear
            </button>
          </div>
        )}

        <div className="map-container" style={{ position: "relative" }}>
          <ComposableMap
            projectionConfig={{
              scale: 147,
            }}
            width={800}
            height={400}
          >
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const isSelected = selectedCountry === geo.properties.name;
                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      onMouseEnter={() => {
                        setTooltip(geo.properties.name);
                      }}
                      onMouseLeave={() => {
                        setTooltip("");
                      }}
                      onClick={() => {
                        setSelectedCountry(geo.properties.name);
                      }}
                      style={{
                        default: {
                          fill: isSelected ? "#FF5722" : "#D6D6DA",
                          stroke: "#FFFFFF",
                          strokeWidth: 0.75,
                          outline: "none",
                        },
                        hover: {
                          fill: isSelected ? "#FF5722" : "#F53",
                          stroke: "#FFFFFF",
                          strokeWidth: 1,
                          outline: "none",
                          cursor: "pointer",
                        },
                        pressed: {
                          fill: "#E42",
                          stroke: "#FFFFFF",
                          strokeWidth: 1,
                          outline: "none",
                        },
                      }}
                    />
                  );
                })
              }
            </Geographies>
          </ComposableMap>

          {tooltip && (
            <div
              className="tooltip"
              style={{
                position: "fixed",
                pointerEvents: "none",
                background: "rgba(0, 0, 0, 0.8)",
                color: "white",
                padding: "8px 12px",
                borderRadius: "4px",
                fontSize: "14px",
              }}
            >
              {tooltip}
            </div>
          )}
        </div>

        <div className="info-panel" style={{ marginTop: "20px" }}>
          <h3>Features Demonstrated</h3>
          <ul style={{ marginLeft: "20px", color: "#555" }}>
            <li>
              <strong>Hover Effects:</strong> Using <code>onMouseEnter</code> and{" "}
              <code>onMouseLeave</code> to show country names
            </li>
            <li>
              <strong>Click Events:</strong> Using <code>onClick</code> to select countries
            </li>
            <li>
              <strong>Dynamic Styling:</strong> Different styles for default, hover, and pressed states
            </li>
            <li>
              <strong>Conditional Rendering:</strong> Highlighting selected country with a different color
            </li>
          </ul>
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
            {`const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

<Geography
  geography={geo}
  onClick={() => setSelectedCountry(geo.properties.name)}
  onMouseEnter={() => setTooltip(geo.properties.name)}
  onMouseLeave={() => setTooltip("")}
  style={{
    default: { fill: isSelected ? "#FF5722" : "#D6D6DA" },
    hover: { fill: "#F53", cursor: "pointer" },
    pressed: { fill: "#E42" },
  }}
/>`}
          </pre>
        </div>
      </div>
    </div>
  );
}

