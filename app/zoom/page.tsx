"use client";

import { useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from "react-simple-maps";
import Navigation from "@/components/Navigation";

const geoUrl =
  "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

export default function ZoomPage() {
  const [position, setPosition] = useState({ coordinates: [0, 0], zoom: 1 });

  function handleZoomIn() {
    if (position.zoom >= 4) return;
    setPosition((pos) => ({ ...pos, zoom: pos.zoom * 2 }));
  }

  function handleZoomOut() {
    if (position.zoom <= 1) return;
    setPosition((pos) => ({ ...pos, zoom: pos.zoom / 2 }));
  }

  function handleMoveEnd(position: { coordinates: [number, number]; zoom: number }) {
    setPosition(position);
  }

  function handleReset() {
    setPosition({ coordinates: [0, 0], zoom: 1 });
  }

  return (
    <div className="container">
      <Navigation />

      <div className="demo-section">
        <h2>Zoom & Pan Controls</h2>
        <p>
          The <code>ZoomableGroup</code> component enables interactive zoom and pan
          functionality. You can zoom in/out using buttons or by scrolling with your
          mouse wheel, and pan by clicking and dragging.
        </p>

        <div className="controls">
          <button onClick={handleZoomIn} disabled={position.zoom >= 4}>
            Zoom In
          </button>
          <button onClick={handleZoomOut} disabled={position.zoom <= 1}>
            Zoom Out
          </button>
          <button onClick={handleReset}>
            Reset
          </button>
          <div
            style={{
              padding: "8px 16px",
              background: "#f0f0f0",
              borderRadius: "4px",
              fontSize: "14px",
            }}
          >
            Zoom: {position.zoom.toFixed(2)}x | Center: [{position.coordinates[0].toFixed(2)}, {position.coordinates[1].toFixed(2)}]
          </div>
        </div>

        <div className="map-container">
          <ComposableMap
            width={800}
            height={400}
          >
            <ZoomableGroup
              zoom={position.zoom}
              center={position.coordinates as [number, number]}
              onMoveEnd={handleMoveEnd}
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
            </ZoomableGroup>
          </ComposableMap>
        </div>

        <div className="info-panel" style={{ marginTop: "20px" }}>
          <h3>Quick Actions</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "10px", marginTop: "10px" }}>
            <button
              onClick={() => setPosition({ coordinates: [100, 35], zoom: 3 })}
              style={{ padding: "10px", background: "#4CAF50", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
            >
              🇨🇳 Zoom to China
            </button>
            <button
              onClick={() => setPosition({ coordinates: [-95, 37], zoom: 3 })}
              style={{ padding: "10px", background: "#2196F3", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
            >
              🇺🇸 Zoom to USA
            </button>
            <button
              onClick={() => setPosition({ coordinates: [10, 51], zoom: 3 })}
              style={{ padding: "10px", background: "#FF9800", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
            >
              🇪🇺 Zoom to Europe
            </button>
            <button
              onClick={() => setPosition({ coordinates: [25, -15], zoom: 2.5 })}
              style={{ padding: "10px", background: "#9C27B0", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
            >
              🌍 Zoom to Africa
            </button>
          </div>
        </div>

        <div className="info-panel" style={{ marginTop: "20px" }}>
          <h3>Features Demonstrated</h3>
          <ul style={{ marginLeft: "20px", color: "#555" }}>
            <li>
              <strong>Zoom Controls:</strong> Programmatic zoom in/out with buttons
            </li>
            <li>
              <strong>Mouse Wheel:</strong> Scroll to zoom in/out
            </li>
            <li>
              <strong>Click & Drag:</strong> Pan around the map by dragging
            </li>
            <li>
              <strong>Position State:</strong> Track and control zoom level and center coordinates
            </li>
            <li>
              <strong>Animated Navigation:</strong> Smooth transitions when changing position
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
            {`import { ZoomableGroup } from "react-simple-maps";

const [position, setPosition] = useState({
  coordinates: [0, 0],
  zoom: 1
});

function handleMoveEnd(position) {
  setPosition(position);
}

<ComposableMap>
  <ZoomableGroup
    zoom={position.zoom}
    center={position.coordinates}
    onMoveEnd={handleMoveEnd}
  >
    <Geographies geography={geoUrl}>
      {/* ... */}
    </Geographies>
  </ZoomableGroup>
</ComposableMap>`}
          </pre>
        </div>
      </div>
    </div>
  );
}

