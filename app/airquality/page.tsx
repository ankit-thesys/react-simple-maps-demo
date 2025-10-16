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
import StatsPanel from "@/components/airquality/StatsPanel";
import FilterControls from "@/components/airquality/FilterControls";
import TimelineControls from "@/components/airquality/TimelineControls";
import AirQualityDetails from "@/components/airquality/AirQualityDetails";
import HeatmapOverlay from "@/components/airquality/HeatmapOverlay";
import { fetchBatchAirQuality, fetchBatchTimeline, MONITORING_STATIONS } from "@/lib/services/airquality";
import type { AirQualityData, RegionType, PollutantType, TimelineRange } from "@/lib/types/airquality";
import {
  getAQIColor,
  getMarkerSize,
  filterByRegion,
  filterByAQIThreshold,
  generateTimelineSteps,
  REGION_ZOOMS,
  isUnhealthy,
} from "@/lib/utils/airquality-helpers";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

export default function AirQualityPage() {
  // Data state
  const [currentData, setCurrentData] = useState<AirQualityData[]>([]);
  const [historicalData, setHistoricalData] = useState<Map<string, AirQualityData[]>>(new Map());
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingTimeline, setIsLoadingTimeline] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState(Date.now());

  // Filter state
  const [region, setRegion] = useState<RegionType | "all">("all");
  const [minAQI, setMinAQI] = useState(1);
  const [pollutant, setPollutant] = useState<PollutantType>("all");
  const [showOnlyUnhealthy, setShowOnlyUnhealthy] = useState(false);
  const [heatmapIntensity, setHeatmapIntensity] = useState(50);

  // Timeline state
  const [dateRange, setDateRange] = useState<TimelineRange>(7);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState<1 | 2 | 4>(1);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timestamps, setTimestamps] = useState<number[]>([]);

  // Interaction state
  const [selectedStation, setSelectedStation] = useState<AirQualityData | null>(null);
  const [hoveredStation, setHoveredStation] = useState<AirQualityData | null>(null);
  const [position, setPosition] = useState({ coordinates: [0, 20] as [number, number], zoom: 1 });

  // Load current air quality data
  const loadCurrentData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const stations = region === "all" 
        ? MONITORING_STATIONS 
        : MONITORING_STATIONS.filter(s => s.region === region);
      
      const data = await fetchBatchAirQuality(stations);
      setCurrentData(data);
      setLastUpdated(Date.now());
    } catch (err) {
      setError("Failed to load air quality data. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [region]);

  // Load historical data for timeline
  const loadHistoricalData = useCallback(async () => {
    setIsLoadingTimeline(true);
    try {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - dateRange);

      const stations = region === "all" 
        ? MONITORING_STATIONS 
        : MONITORING_STATIONS.filter(s => s.region === region);

      // Generate timeline steps
      const timelineSteps = generateTimelineSteps(startDate, endDate, 6);
      setTimestamps(timelineSteps);
      setCurrentIndex(timelineSteps.length - 1); // Start at most recent

      // Fetch historical data
      const data = await fetchBatchTimeline(stations, startDate, endDate);
      setHistoricalData(data);
    } catch (err) {
      console.error("Error loading historical data:", err);
      setError("Failed to load historical data. Showing current data only.");
    } finally {
      setIsLoadingTimeline(false);
    }
  }, [dateRange, region]);

  // Initial load
  useEffect(() => {
    loadCurrentData();
  }, [loadCurrentData]);

  // Load historical data when date range changes
  useEffect(() => {
    if (dateRange > 0) {
      loadHistoricalData();
    }
  }, [loadHistoricalData]);

  // Auto-refresh current data every 30 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      loadCurrentData();
    }, 30 * 60 * 1000); // 30 minutes

    return () => clearInterval(interval);
  }, [loadCurrentData]);

  // Timeline animation
  useEffect(() => {
    if (!isPlaying || timestamps.length === 0) return;

    const intervalTime = 1000 / speed; // Adjust based on speed
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        if (prevIndex >= timestamps.length - 1) {
          setIsPlaying(false); // Stop at end
          return prevIndex;
        }
        return prevIndex + 1;
      });
    }, intervalTime);

    return () => clearInterval(interval);
  }, [isPlaying, speed, timestamps.length]);

  // Get data for current timeline position
  const displayData = useMemo(() => {
    if (timestamps.length === 0 || historicalData.size === 0) {
      return currentData;
    }

    const currentTimestamp = timestamps[currentIndex];
    const timelineData: AirQualityData[] = [];

    // Collect data from all stations at this timestamp
    historicalData.forEach((stationData) => {
      // Find closest data point to current timestamp
      const closest = stationData.reduce((prev, curr) =>
        Math.abs(curr.timestamp - currentTimestamp) < Math.abs(prev.timestamp - currentTimestamp)
          ? curr
          : prev
      );
      if (closest) {
        timelineData.push(closest);
      }
    });

    return timelineData.length > 0 ? timelineData : currentData;
  }, [timestamps, currentIndex, historicalData, currentData]);

  // Apply filters
  const filteredData = useMemo(() => {
    let filtered = displayData;

    // Region filter
    filtered = filterByRegion(filtered, region);

    // AQI threshold filter
    filtered = filterByAQIThreshold(filtered, minAQI);

    // Show only unhealthy
    if (showOnlyUnhealthy) {
      filtered = filtered.filter((item) => isUnhealthy(item.aqi));
    }

    return filtered;
  }, [displayData, region, minAQI, showOnlyUnhealthy]);

  // Timeline controls
  const handleStepBackward = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleStepForward = () => {
    setCurrentIndex((prev) => Math.min(timestamps.length - 1, prev + 1));
  };

  const currentTimestamp = timestamps[currentIndex] || Date.now();

  return (
    <div className="container">
      <Navigation />

      <div className="demo-section">
        <div className="earthquake-header">
          <div>
            <h2>🌫️ Real-Time Air Quality Dashboard</h2>
            <p>
              Live air quality data with historical playback. Watch pollution patterns change over time.
            </p>
          </div>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <StatsPanel data={filteredData} lastUpdated={lastUpdated} />

        <FilterControls
          region={region}
          setRegion={setRegion}
          minAQI={minAQI}
          setMinAQI={setMinAQI}
          pollutant={pollutant}
          setPollutant={setPollutant}
          showOnlyUnhealthy={showOnlyUnhealthy}
          setShowOnlyUnhealthy={setShowOnlyUnhealthy}
          heatmapIntensity={heatmapIntensity}
          setHeatmapIntensity={setHeatmapIntensity}
          onRefresh={loadCurrentData}
          isLoading={isLoading}
        />

        <div className="region-zoom-buttons">
          <strong>Quick Zoom:</strong>
          {REGION_ZOOMS.map((regionZoom) => (
            <button
              key={regionZoom.name}
              onClick={() =>
                setPosition({ coordinates: regionZoom.coordinates, zoom: regionZoom.zoom })
              }
              className="region-btn"
            >
              {regionZoom.name}
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

                {/* Heatmap layer */}
                <HeatmapOverlay data={filteredData} intensity={heatmapIntensity} />

                {/* Markers */}
                {filteredData.map((station) => {
                  const isPulsing = isUnhealthy(station.aqi);
                  return (
                    <Marker
                      key={station.id}
                      coordinates={station.coordinates}
                    >
                      <circle
                        r={getMarkerSize(station.aqi)}
                        fill={getAQIColor(station.aqi)}
                        stroke="#fff"
                        strokeWidth={1.5}
                        fillOpacity={0.8}
                        className={isPulsing ? "aqi-marker pulse" : "aqi-marker"}
                        onMouseEnter={() => setHoveredStation(station)}
                        onMouseLeave={() => setHoveredStation(null)}
                        onClick={() => setSelectedStation(station)}
                        style={{ cursor: "pointer" }}
                      />
                    </Marker>
                  );
                })}
              </ZoomableGroup>
            </ComposableMap>

            {/* Hover tooltip */}
            {hoveredStation && !selectedStation && (
              <div className="earthquake-tooltip">
                <strong>{hoveredStation.stationName}</strong>
                <div>AQI: {hoveredStation.aqi} ({getAQIColor(hoveredStation.aqi)})</div>
                <div className="tooltip-time">
                  PM2.5: {hoveredStation.pollutants.pm2_5.toFixed(1)} μg/m³
                </div>
              </div>
            )}
          </div>

          {/* Details panel */}
          {selectedStation && (
            <AirQualityDetails
              data={selectedStation}
              onClose={() => setSelectedStation(null)}
            />
          )}
        </div>

        {/* Timeline controls */}
        <TimelineControls
          dateRange={dateRange}
          setDateRange={setDateRange}
          isPlaying={isPlaying}
          setIsPlaying={setIsPlaying}
          speed={speed}
          setSpeed={setSpeed}
          currentTimestamp={currentTimestamp}
          timestamps={timestamps}
          currentIndex={currentIndex}
          setCurrentIndex={setCurrentIndex}
          onStepBackward={handleStepBackward}
          onStepForward={handleStepForward}
          isLoading={isLoadingTimeline}
        />

        {/* Legend */}
        <div className="legend">
          <h3>AQI Scale</h3>
          <div className="legend-items">
            <div className="legend-item">
              <div className="legend-circle" style={{ background: "#4CAF50" }} />
              <span>1 - Good</span>
            </div>
            <div className="legend-item">
              <div className="legend-circle" style={{ background: "#FFEB3B" }} />
              <span>2 - Moderate</span>
            </div>
            <div className="legend-item">
              <div className="legend-circle" style={{ background: "#FF9800" }} />
              <span>3 - Unhealthy for Sensitive</span>
            </div>
            <div className="legend-item">
              <div className="legend-circle" style={{ background: "#F44336" }} />
              <span>4 - Unhealthy</span>
            </div>
            <div className="legend-item">
              <div className="legend-circle" style={{ background: "#9C27B0" }} />
              <span>5 - Very Unhealthy</span>
            </div>
            <div className="legend-item">
              <div className="legend-circle pulse" style={{ background: "#F44336" }} />
              <span>Unhealthy (pulsing)</span>
            </div>
          </div>
          <div style={{ marginTop: "10px", fontSize: "13px", color: "#666" }}>
            Circle size = AQI level | Heatmap = Pollution spread
          </div>
        </div>

        {/* Info panel */}
        <div className="info-panel" style={{ marginTop: "20px" }}>
          <h3>About This Dashboard</h3>
          <p>
            This dashboard uses the <strong>OpenWeather Air Pollution API</strong> to display
            real-time air quality data across major cities in the US, Europe, India, and China.
            Use the timeline controls to watch how air quality changes over time.
          </p>
          <ul style={{ marginLeft: "20px", color: "#555", marginTop: "10px" }}>
            <li>Click any marker to see detailed pollutant information</li>
            <li>Use the timeline slider to explore historical data (7-30 days)</li>
            <li>Press play to watch animated air quality changes</li>
            <li>Adjust heatmap intensity to visualize pollution spread</li>
            <li>Filter by region to focus on specific areas</li>
            <li>Data automatically refreshes every 30 minutes</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

