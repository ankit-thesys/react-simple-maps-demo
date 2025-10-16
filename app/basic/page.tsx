"use client";

import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import Navigation from "@/components/Navigation";

const geoUrl =
  "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

export default function BasicMapPage() {
  return (
    <div className="container">
      <Navigation />

      <div className="demo-section">
        <h2>Basic World Map</h2>
        <p>
          This is the simplest example of react-simple-maps. It renders a world
          map using a TopoJSON file. The map is composed of three main components:
        </p>
        <ul style={{ marginLeft: "20px", marginBottom: "20px", color: "#666" }}>
          <li>
            <code>ComposableMap</code>: The wrapper component that creates the SVG container
          </li>
          <li>
            <code>Geographies</code>: Loads and processes the geography data
          </li>
          <li>
            <code>Geography</code>: Renders each individual geography (country) as an SVG path
          </li>
        </ul>

        <div className="map-container">
          <ComposableMap
            projectionConfig={{
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
                  />
                ))
              }
            </Geographies>
          </ComposableMap>
        </div>

        <div className="info-panel" style={{ marginTop: "20px" }}>
          <h3>Code Example</h3>
          <pre
            style={{
              background: "#1e1e1e",
              color: "#d4d4d4",
              padding: "15px",
              borderRadius: "4px",
              overflow: "auto",
              fontSize: "14px",
            }}
          >
            {`import { ComposableMap, Geographies, Geography } from "react-simple-maps";

const geoUrl = "https://raw.githubusercontent.com/deldersveld/topojson/master/world-countries.json";

export default function BasicMap() {
  return (
    <ComposableMap>
      <Geographies geography={geoUrl}>
        {({ geographies }) =>
          geographies.map((geo) => (
            <Geography
              key={geo.rsmKey}
              geography={geo}
              fill="#EAEAEC"
              stroke="#D6D6DA"
            />
          ))
        }
      </Geographies>
    </ComposableMap>
  );
}`}
          </pre>
        </div>

        <div className="info-panel" style={{ marginTop: "20px" }}>
          <h3>Key Points</h3>
          <ul style={{ marginLeft: "20px", color: "#555" }}>
            <li>The <code>geography</code> prop accepts a URL to a TopoJSON or GeoJSON file</li>
            <li>Each geography needs a unique <code>key</code> prop (use <code>geo.rsmKey</code>)</li>
            <li>Style properties like <code>fill</code> and <code>stroke</code> work like SVG attributes</li>
            <li>The map automatically handles projection and rendering</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

