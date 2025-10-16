"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
} from "react-simple-maps";
import Navigation from "@/components/Navigation";
import StatsPanel from "@/components/earthquake/StatsPanel";
import FilterControls from "@/components/earthquake/FilterControls";
import EarthquakeDetails from "@/components/earthquake/EarthquakeDetails";
import { fetchEarthquakes } from "@/lib/services/earthquake";
import type { Earthquake, TimeRange, DepthFilter } from "@/lib/types/earthquake";
import {
  getDepthColor,
  getMagnitudeSize,
  filterEarthquakesByDepth,
  filterEarthquakesByMagnitude,
  formatTimeAgo,
  isRecentEarthquake,
  REGION_ZOOMS,
} from "@/lib/utils/earthquake-helpers";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

export default function EarthquakePage() {
  const [earthquakes, setEarthquakes] = useState<Earthquake[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState(Date.now());
  
  // Filters
  const [minMagnitude, setMinMagnitude] = useState(2.5);
  const [timeRange, setTimeRange] = useState<TimeRange>("day");
  const [depthFilter, setDepthFilter] = useState<DepthFilter>("all");
  
  // Interaction
  const [selectedEarthquake, setSelectedEarthquake] = useState<Earthquake | null>(null);
  const [hoveredEarthquake, setHoveredEarthquake] = useState<Earthquake | null>(null);
  const [position, setPosition] = useState({ coordinates: [0, 20] as [number, number], zoom: 1 });

  // Fetch earthquake data
  const loadEarthquakes = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchEarthquakes(timeRange);
      setEarthquakes(data);
      setLastUpdated(Date.now());
    } catch (err) {
      setError("Failed to load earthquake data. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [timeRange]);

  useEffect(() => {
    loadEarthquakes();
  }, [loadEarthquakes]);

  // Auto-refresh every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      loadEarthquakes();
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, [loadEarthquakes]);

  // Filter earthquakes
  const filteredEarthquakes = useMemo(() => {
    let filtered = earthquakes;
    filtered = filterEarthquakesByMagnitude(filtered, minMagnitude);
    filtered = filterEarthquakesByDepth(filtered, depthFilter);
    return filtered;
  }, [earthquakes, minMagnitude, depthFilter]);

  return (
    <div className="container">
      <Navigation />

      <div className="demo-section">
        <div className="earthquake-header">
          <div>
            <h2>🌍 Real-Time Earthquake Dashboard</h2>
            <p>
              Live earthquake data from USGS. Click markers for details, use filters to
              explore patterns.
            </p>
          </div>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <StatsPanel earthquakes={filteredEarthquakes} lastUpdated={lastUpdated} />

        <FilterControls
          minMagnitude={minMagnitude}
          setMinMagnitude={setMinMagnitude}
          timeRange={timeRange}
          setTimeRange={setTimeRange}
          depthFilter={depthFilter}
          setDepthFilter={setDepthFilter}
          onRefresh={loadEarthquakes}
          isLoading={isLoading}
        />

        <div className="region-zoom-buttons">
          <strong>Quick Zoom:</strong>
          {REGION_ZOOMS.map((region) => (
            <button
              key={region.name}
              onClick={() =>
                setPosition({ coordinates: region.coordinates, zoom: region.zoom })
              }
              className="region-btn"
            >
              {region.name}
            </button>
          ))}
        </div>

        <div className="earthquake-map-container">
          <div className="map-wrapper">
            <ComposableMap
              width={800}
              height={500}
              projectionConfig={{
                scale: 147,
              }}
            >
              <ZoomableGroup
                zoom={position.zoom}
                center={position.coordinates}
                onMoveEnd={setPosition}
              >
                <Geographies geography={geoUrl}>
                  {({ geographies }) =>
                    geographies.map((geo) => (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        fill="#1a1a1a"
                        stroke="#333"
                        strokeWidth={0.5}
                      />
                    ))
                  }
                </Geographies>

                {filteredEarthquakes.map((earthquake) => {
                  const isRecent = isRecentEarthquake(earthquake.time, 24);
                  return (
                    <Marker
                      key={earthquake.id}
                      coordinates={earthquake.coordinates}
                    >
                      <circle
                        r={getMagnitudeSize(earthquake.magnitude)}
                        fill={getDepthColor(earthquake.depth)}
                        stroke="#fff"
                        strokeWidth={1}
                        fillOpacity={isRecent ? 0.8 : 0.5}
                        className={isRecent ? "earthquake-marker pulse" : "earthquake-marker"}
                        onMouseEnter={() => setHoveredEarthquake(earthquake)}
                        onMouseLeave={() => setHoveredEarthquake(null)}
                        onClick={() => setSelectedEarthquake(earthquake)}
                        style={{ cursor: "pointer" }}
                      />
                    </Marker>
                  );
                })}
              </ZoomableGroup>
            </ComposableMap>

            {hoveredEarthquake && !selectedEarthquake && (
              <div className="earthquake-tooltip">
                <strong>M {hoveredEarthquake.magnitude.toFixed(1)}</strong>
                <div>{hoveredEarthquake.place}</div>
                <div className="tooltip-time">
                  {formatTimeAgo(hoveredEarthquake.time)}
                </div>
              </div>
            )}
          </div>

          {selectedEarthquake && (
            <EarthquakeDetails
              earthquake={selectedEarthquake}
              onClose={() => setSelectedEarthquake(null)}
            />
          )}
        </div>

        <div className="legend">
          <h3>Legend</h3>
          <div className="legend-items">
            <div className="legend-item">
              <div
                className="legend-circle"
                style={{ background: "#FF5722" }}
              />
              <span>Shallow (0-70 km)</span>
            </div>
            <div className="legend-item">
              <div
                className="legend-circle"
                style={{ background: "#FF9800" }}
              />
              <span>Intermediate (70-300 km)</span>
            </div>
            <div className="legend-item">
              <div
                className="legend-circle"
                style={{ background: "#2196F3" }}
              />
              <span>Deep (&gt;300 km)</span>
            </div>
            <div className="legend-item">
              <div className="legend-circle pulse" style={{ background: "#FF5722" }} />
              <span>Last 24 hours (pulsing)</span>
            </div>
          </div>
          <div style={{ marginTop: "10px", fontSize: "13px", color: "#666" }}>
            Circle size = Earthquake magnitude
          </div>
        </div>

        <div className="info-panel" style={{ marginTop: "20px" }}>
          <h3>About This Dashboard</h3>
          <p>
            This dashboard uses the <strong>USGS Earthquake API</strong> to display
            real-time seismic activity worldwide. Earthquakes are color-coded by depth
            and sized by magnitude. The data automatically refreshes every 5 minutes.
          </p>
          <ul style={{ marginLeft: "20px", color: "#555", marginTop: "10px" }}>
            <li>Click any earthquake marker to see detailed information</li>
            <li>Hover over markers to see quick info</li>
            <li>Use filters to focus on specific magnitude ranges or depths</li>
            <li>Quick zoom buttons help you explore active regions</li>
            <li>Scroll to zoom, drag to pan the map</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

