"use client";

import { useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  Annotation,
} from "react-simple-maps";
import Navigation from "@/components/Navigation";

const geoUrl =
  "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const cities = [
  { name: "Tokyo", coordinates: [139.6917, 35.6895], population: "37.4M" },
  { name: "Delhi", coordinates: [77.1025, 28.7041], population: "32.9M" },
  { name: "Shanghai", coordinates: [121.4737, 31.2304], population: "28.5M" },
  { name: "São Paulo", coordinates: [-46.6333, -23.5505], population: "22.4M" },
  { name: "Mexico City", coordinates: [-99.1332, 19.4326], population: "22.1M" },
  { name: "Cairo", coordinates: [31.2357, 30.0444], population: "21.3M" },
  { name: "Mumbai", coordinates: [72.8777, 19.076], population: "20.7M" },
  { name: "Beijing", coordinates: [116.4074, 39.9042], population: "20.4M" },
  { name: "New York", coordinates: [-74.006, 40.7128], population: "18.8M" },
  { name: "London", coordinates: [-0.1276, 51.5074], population: "9.3M" },
  { name: "Paris", coordinates: [2.3522, 48.8566], population: "11.0M" },
  { name: "Sydney", coordinates: [151.2093, -33.8688], population: "5.3M" },
];

export default function MarkersPage() {
  const [tooltip, setTooltip] = useState("");

  return (
    <div className="container">
      <Navigation />

      <div className="demo-section">
        <h2>Markers & Annotations</h2>
        <p>
          Add custom markers and annotations to highlight specific locations on
          your map. This example shows major world cities with their populations.
        </p>

        <div className="map-container">
          <ComposableMap
            projectionConfig={{
              rotate: [-10, 0, 0],
              scale: 147,
            }}
            width={800}
            height={400}
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
                  />
                ))
              }
            </Geographies>
            {cities.map(({ name, coordinates, population }) => (
              <Marker key={name} coordinates={coordinates as [number, number]}>
                <circle
                  r={4}
                  fill="#F53"
                  stroke="#fff"
                  strokeWidth={1.5}
                  onMouseEnter={() => setTooltip(`${name}: ${population}`)}
                  onMouseLeave={() => setTooltip("")}
                  style={{ cursor: "pointer" }}
                />
              </Marker>
            ))}
            {/* Annotations for selected cities */}
            <Annotation
              subject={[139.6917, 35.6895]}
              dx={-30}
              dy={-30}
              connectorProps={{
                stroke: "#FF5722",
                strokeWidth: 2,
                strokeLinecap: "round",
              }}
            >
              <text
                x="-8"
                textAnchor="end"
                alignmentBaseline="middle"
                fill="#FF5722"
                style={{ fontSize: "14px", fontWeight: "bold" }}
              >
                Tokyo
              </text>
            </Annotation>
            <Annotation
              subject={[-74.006, 40.7128]}
              dx={-40}
              dy={-20}
              connectorProps={{
                stroke: "#2196F3",
                strokeWidth: 2,
                strokeLinecap: "round",
              }}
            >
              <text
                x="-8"
                textAnchor="end"
                alignmentBaseline="middle"
                fill="#2196F3"
                style={{ fontSize: "14px", fontWeight: "bold" }}
              >
                New York
              </text>
            </Annotation>
            <Annotation
              subject={[-0.1276, 51.5074]}
              dx={30}
              dy={-25}
              connectorProps={{
                stroke: "#4CAF50",
                strokeWidth: 2,
                strokeLinecap: "round",
              }}
            >
              <text
                x="8"
                textAnchor="start"
                alignmentBaseline="middle"
                fill="#4CAF50"
                style={{ fontSize: "14px", fontWeight: "bold" }}
              >
                London
              </text>
            </Annotation>
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
              <strong>Markers:</strong> Use the <code>Marker</code> component to add
              custom SVG elements at specific coordinates
            </li>
            <li>
              <strong>Annotations:</strong> Use the <code>Annotation</code> component
              to add labels with connecting lines
            </li>
            <li>
              <strong>Coordinates:</strong> Latitude and longitude as{" "}
              <code>[longitude, latitude]</code> array
            </li>
            <li>
              <strong>Custom Styling:</strong> Full control over marker appearance and
              annotation positioning
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
            {`import { Marker, Annotation } from "react-simple-maps";

const cities = [
  { name: "Tokyo", coordinates: [139.6917, 35.6895] },
  // ... more cities
];

<ComposableMap>
  <Geographies geography={geoUrl}>
    {/* ... geographies */}
  </Geographies>
  
  {/* Add markers */}
  {cities.map(({ name, coordinates }) => (
    <Marker key={name} coordinates={coordinates}>
      <circle r={4} fill="#F53" stroke="#fff" />
    </Marker>
  ))}
  
  {/* Add annotation with label */}
  <Annotation
    subject={[139.6917, 35.6895]}
    dx={-30}
    dy={-30}
    connectorProps={{ stroke: "#FF5722", strokeWidth: 2 }}
  >
    <text fill="#FF5722">Tokyo</text>
  </Annotation>
</ComposableMap>`}
          </pre>
        </div>

        <div className="legend">
          <h3>Major Cities</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "10px" }}>
            {cities.map((city) => (
              <div key={city.name} style={{ padding: "5px" }}>
                <strong>{city.name}</strong>: {city.population}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

