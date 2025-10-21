/**
 * Population Density Heat Map Page
 * 
 * This page visualizes world population data using a choropleth heat map.
 * Users can toggle between viewing population density (people/km²) and
 * total population, with colors interpolated using D3's color scales.
 * 
 * Key Features:
 * - Toggle between density and population views
 * - Filter by continent/region
 * - Interactive tooltips with country details
 * - Statistics panel showing min/max/average values
 * - Color-coded heat map using D3 interpolation
 * - Real-time data from REST Countries API
 * 
 * Data Source: https://restcountries.com/
 */

"use client";

import { useState, useEffect, useMemo } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from "react-simple-maps";
import Navigation from "@/components/Navigation";
import StatsPanel from "@/components/population/StatsPanel";
import { fetchAllCountries, matchCountryByName } from "@/lib/services/population";
import type {
  PopulationData,
  ViewMode,
  RegionFilter,
} from "@/lib/types/population";
import {
  getDensityColor,
  getPopulationColor,
  formatPopulation,
  formatDensity,
  formatArea,
  filterByRegion,
  REGION_ZOOMS,
  getLegendSteps,
  formatPopulationShort,
  interpolateYellowOrangeRed,
} from "@/lib/utils/population-helpers";

// CSS specific to this page
import "./population.css";

/**
 * TopoJSON URL for world geography
 * 
 * We use the same world atlas as other demos for consistency.
 * This contains country boundaries at 110m resolution.
 */
const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

export default function PopulationDensityPage() {
  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================

  /**
   * All country data from REST Countries API
   * Populated on initial load
   */
  const [countries, setCountries] = useState<PopulationData[]>([]);

  /**
   * View mode: "density" or "population"
   * Determines what data to visualize and color scale to use
   */
  const [viewMode, setViewMode] = useState<ViewMode>("density");

  /**
   * Region filter: continent to display
   * "all" shows all countries, otherwise filters to specific continent
   */
  const [regionFilter, setRegionFilter] = useState<RegionFilter>("all");

  /**
   * Currently hovered country for tooltip display
   */
  const [hoveredCountry, setHoveredCountry] = useState<PopulationData | null>(
    null
  );

  /**
   * Loading state while fetching API data
   */
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Error message if API fetch fails
   */
  const [error, setError] = useState<string | null>(null);

  /**
   * Timestamp of last data update
   */
  const [lastUpdated, setLastUpdated] = useState(Date.now());

  /**
   * Map zoom and position state
   */
  const [position, setPosition] = useState({
    coordinates: [0, 20] as [number, number],
    zoom: 1,
  });

  // ============================================================================
  // DATA FETCHING
  // ============================================================================

  /**
   * Fetch country data from REST Countries API on mount
   * 
   * This runs once when the component loads and populates the countries array.
   * The API provides population, area, and region data for all countries.
   */
  useEffect(() => {
    async function loadCountries() {
      setIsLoading(true);
      setError(null);

      try {
        const data = await fetchAllCountries();
        setCountries(data);
        setLastUpdated(Date.now());
      } catch (err) {
        setError("Failed to load country data. Please try again.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }

    loadCountries();
  }, []);

  // ============================================================================
  // DATA PROCESSING
  // ============================================================================

  /**
   * Filter countries based on selected region
   * 
   * Memoized to avoid recalculating on every render.
   */
  const filteredCountries = useMemo(() => {
    return filterByRegion(countries, regionFilter);
  }, [countries, regionFilter]);

  /**
   * Calculate min/max values for color scaling
   * 
   * These values are used to map data values to colors in the heat map.
   * Recalculated when filtered countries or view mode changes.
   */
  const { minValue, maxValue } = useMemo(() => {
    if (filteredCountries.length === 0) {
      return { minValue: 0, maxValue: 1 };
    }

    const values = filteredCountries.map((c) =>
      viewMode === "density" ? c.density : c.population
    );

    return {
      minValue: Math.min(...values),
      maxValue: Math.max(...values),
    };
  }, [filteredCountries, viewMode]);

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================

  /**
   * Handle view mode toggle (density ⇄ population)
   */
  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
  };

  /**
   * Handle region filter change
   */
  const handleRegionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newRegion = event.target.value as RegionFilter;
    setRegionFilter(newRegion);

    // Auto-zoom to selected region
    const regionZoom = REGION_ZOOMS.find((r) => r.region === newRegion);
    if (regionZoom) {
      setPosition({
        coordinates: regionZoom.coordinates,
        zoom: regionZoom.zoom,
      });
    }
  };

  /**
   * Get color for a country based on current view mode
   * 
   * Uses D3 color interpolation to map values to yellow→orange→red gradient.
   * 
   * @param country Country data
   * @returns RGB color string
   */
  const getCountryColor = (country: PopulationData | undefined): string => {
    if (!country) {
      return "#E0E0E0"; // Gray for no data
    }

    if (viewMode === "density") {
      return getDensityColor(country.density, minValue, maxValue);
    } else {
      return getPopulationColor(country.population, minValue, maxValue);
    }
  };

  // ============================================================================
  // LEGEND GENERATION
  // ============================================================================

  /**
   * Generate legend steps for color scale
   * 
   * Creates 5 evenly spaced values across the min-max range
   * to display in the color legend.
   */
  const legendSteps = useMemo(() => {
    return getLegendSteps(minValue, maxValue, 5);
  }, [minValue, maxValue]);

  /**
   * Format legend label based on view mode
   */
  const formatLegendLabel = (value: number): string => {
    return viewMode === "density"
      ? formatDensity(value)
      : formatPopulationShort(value);
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  /**
   * Loading state
   */
  if (isLoading) {
    return (
      <div className="container">
        <Navigation />
        <div className="demo-section">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <div className="loading-text">Loading population data...</div>
          </div>
        </div>
      </div>
    );
  }

  /**
   * Error state
   */
  if (error) {
    return (
      <div className="container">
        <Navigation />
        <div className="demo-section">
          <div className="error-message">{error}</div>
          <button
            onClick={() => window.location.reload()}
            className="refresh-btn"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <Navigation />

      <div className="demo-section">
        {/* ====================================================================
            HEADER
            ==================================================================== */}
        <div className="earthquake-header">
          <div>
            <h2>🌍 World Population Density Heat Map</h2>
            <p>
              Interactive visualization of population data using D3 color
              interpolation. Toggle between density and total population views.
            </p>
          </div>
        </div>

        {/* ====================================================================
            STATISTICS PANEL
            ==================================================================== */}
        <StatsPanel
          countries={filteredCountries}
          viewMode={viewMode}
          lastUpdated={lastUpdated}
        />

        {/* ====================================================================
            CONTROLS
            ==================================================================== */}
        <div className="population-controls">
          {/* View Mode Toggle */}
          <div className="view-mode-toggle">
            <label>View Mode:</label>
            <div className="toggle-buttons">
              <button
                className={`toggle-btn ${viewMode === "density" ? "active" : ""}`}
                onClick={() => handleViewModeChange("density")}
              >
                Population Density
              </button>
              <button
                className={`toggle-btn ${viewMode === "population" ? "active" : ""}`}
                onClick={() => handleViewModeChange("population")}
              >
                Total Population
              </button>
            </div>
          </div>

          {/* Region Filter */}
          <div className="region-filter">
            <label>Filter by Region:</label>
            <select
              className="region-select"
              value={regionFilter}
              onChange={handleRegionChange}
            >
              <option value="all">All Regions</option>
              <option value="Africa">Africa</option>
              <option value="Americas">Americas</option>
              <option value="Asia">Asia</option>
              <option value="Europe">Europe</option>
              <option value="Oceania">Oceania</option>
            </select>
          </div>
        </div>

        {/* ====================================================================
            QUICK ZOOM BUTTONS
            ==================================================================== */}
        <div className="region-zoom-buttons">
          <strong>Quick Zoom:</strong>
          {REGION_ZOOMS.map((region) => (
            <button
              key={region.name}
              onClick={() =>
                setPosition({
                  coordinates: region.coordinates,
                  zoom: region.zoom,
                })
              }
              className="region-btn"
            >
              {region.name}
            </button>
          ))}
        </div>

        {/* ====================================================================
            MAP VISUALIZATION
            ==================================================================== */}
        <div className="population-map-container">
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
              {/* 
                Geographies Component
                
                Loads the TopoJSON file and renders each country.
                For each country in the map, we:
                1. Match it with our API data by name
                2. Determine the appropriate color based on view mode
                3. Handle hover events for tooltip display
              */}
              <Geographies geography={geoUrl}>
                {({ geographies }) =>
                  geographies.map((geo) => {
                    // Match map country with API data
                    const countryName = geo.properties.name;
                    const countryData = matchCountryByName(
                      countryName,
                      filteredCountries
                    );

                    // Determine fill color using D3 interpolation
                    const fillColor = getCountryColor(countryData);

                    // Check if country has data
                    const hasData = countryData !== undefined;

                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        fill={fillColor}
                        stroke="#FFFFFF"
                        strokeWidth={0.5}
                        className={
                          hasData ? "country-geography" : "no-data-country"
                        }
                        onMouseEnter={() => {
                          if (countryData) {
                            setHoveredCountry(countryData);
                          }
                        }}
                        onMouseLeave={() => {
                          setHoveredCountry(null);
                        }}
                        style={{
                          hover: hasData
                            ? {
                                stroke: "#FFFFFF",
                                strokeWidth: 1.5,
                                outline: "none",
                              }
                            : {},
                        }}
                      />
                    );
                  })
                }
              </Geographies>
            </ZoomableGroup>
          </ComposableMap>

          {/* ====================================================================
              TOOLTIP
              ==================================================================== */}
          {hoveredCountry && (
            <div className="population-tooltip">
              <h4>{hoveredCountry.name}</h4>
              <div className="tooltip-row">
                <span className="tooltip-label">Population:</span>
                <span
                  className={`tooltip-value ${viewMode === "population" ? "tooltip-highlight" : ""}`}
                >
                  {formatPopulation(hoveredCountry.population)}
                </span>
              </div>
              <div className="tooltip-row">
                <span className="tooltip-label">Area:</span>
                <span className="tooltip-value">
                  {formatArea(hoveredCountry.area)}
                </span>
              </div>
              <div className="tooltip-row">
                <span className="tooltip-label">Density:</span>
                <span
                  className={`tooltip-value ${viewMode === "density" ? "tooltip-highlight" : ""}`}
                >
                  {formatDensity(hoveredCountry.density)}
                </span>
              </div>
              {hoveredCountry.capital && (
                <div className="tooltip-row">
                  <span className="tooltip-label">Capital:</span>
                  <span className="tooltip-value">{hoveredCountry.capital}</span>
                </div>
              )}
              <div className="tooltip-row">
                <span className="tooltip-label">Region:</span>
                <span className="tooltip-value">{hoveredCountry.region}</span>
              </div>
            </div>
          )}
        </div>

        {/* ====================================================================
            COLOR LEGEND
            ==================================================================== */}
        <div className="population-legend">
          <h3>
            {viewMode === "density"
              ? "Population Density (people/km²)"
              : "Total Population"}
          </h3>
          
          {/* Gradient Bar */}
          <div
            className="legend-gradient"
            style={{
              background: `linear-gradient(to right, ${legendSteps
                .map((_, i) =>
                  interpolateYellowOrangeRed(i / (legendSteps.length - 1))
                )
                .join(", ")})`,
            }}
          ></div>

          {/* Legend Labels */}
          <div className="legend-labels">
            {legendSteps.map((value, index) => (
              <div key={index} className="legend-label">
                {formatLegendLabel(value)}
              </div>
            ))}
          </div>

          <div className="legend-explanation">
            Colors interpolated using D3 scale from yellow (low) to red (high)
          </div>
        </div>

        {/* ====================================================================
            D3 INTERPOLATION EXPLANATION
            ==================================================================== */}
        <div className="d3-explanation">
          <h3>How D3 Color Interpolation Works</h3>
          <p>
            This visualization uses <code>D3 color interpolation</code> to
            create a smooth gradient from yellow → orange → red. The color
            scale dynamically adjusts based on the min/max values in the
            current view.
          </p>
          <p>
            <strong>Custom Interpolation Function:</strong> We use a custom
            interpolator that blends three colors:
          </p>
          <ul style={{ marginLeft: "20px", color: "#555", marginTop: "8px" }}>
            <li>
              <strong style={{ color: "#ffff64" }}>Yellow</strong> - Low
              values (least dense/populous)
            </li>
            <li>
              <strong style={{ color: "#ff8c00" }}>Orange</strong> - Medium
              values
            </li>
            <li>
              <strong style={{ color: "#dc0000" }}>Red</strong> - High values
              (most dense/populous)
            </li>
          </ul>
          <div className="code-example">
            {`// D3 Sequential Scale with custom interpolator
const scale = scaleSequential(interpolateYellowOrangeRed)
  .domain([minValue, maxValue]);

// Get color for a value
const color = scale(countryValue);`}
          </div>
        </div>

        {/* ====================================================================
            DATA SOURCE INFO
            ==================================================================== */}
        <div className="info-panel" style={{ marginTop: "20px" }}>
          <h3>About This Visualization</h3>
          <p>
            This heat map uses real-time data from the{" "}
            <strong>REST Countries API</strong> to visualize population
            statistics worldwide.
          </p>
          <ul style={{ marginLeft: "20px", color: "#555", marginTop: "10px" }}>
            <li>
              <strong>Population Density</strong>: Calculated as population
              divided by land area (people per km²)
            </li>
            <li>
              <strong>Total Population</strong>: Shows the absolute population
              of each country
            </li>
            <li>
              <strong>Color Coding</strong>: Warmer colors indicate higher
              values (denser or more populous)
            </li>
            <li>
              Hover over countries to see detailed statistics
            </li>
            <li>
              Use the region filter to focus on specific continents
            </li>
            <li>
              Scroll to zoom, drag to pan the map
            </li>
          </ul>
          <p style={{ marginTop: "12px" }}>
            <strong>Data Source:</strong>{" "}
            <a
              href="https://restcountries.com/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#007bff" }}
            >
              REST Countries API
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}


