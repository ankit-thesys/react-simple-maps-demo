/**
 * Population Statistics Panel Component
 * 
 * Displays key statistics about the current population data view:
 * - Total number of countries
 * - Min/Max/Average values (density or population based on view mode)
 * - Highlighted countries with extreme values
 * - Last updated timestamp
 * 
 * This component uses the existing stat-card styles from globals.css
 */

"use client";

import type { PopulationData, ViewMode } from "@/lib/types/population";
import {
  formatPopulation,
  formatPopulationShort,
  formatDensity,
  calculateStatistics,
} from "@/lib/utils/population-helpers";

interface StatsPanelProps {
  countries: PopulationData[];
  viewMode: ViewMode;
  lastUpdated: number;
}

export default function StatsPanel({
  countries,
  viewMode,
  lastUpdated,
}: StatsPanelProps) {
  // Calculate statistics based on current view mode
  const stats = calculateStatistics(countries, viewMode);

  // Format last updated time
  const lastUpdatedTime = new Date(lastUpdated).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  // Format values based on view mode
  const formatValue = (value: number) => {
    return viewMode === "density"
      ? formatDensity(value)
      : formatPopulationShort(value);
  };

  const formatFullValue = (value: number) => {
    return viewMode === "density"
      ? formatDensity(value)
      : formatPopulation(value);
  };

  const valueLabel = viewMode === "density" ? "Density" : "Population";

  return (
    <div className="stats-panel">
      <div className="stats-grid">
        {/* Total Countries */}
        <div className="stat-card">
          <div className="stat-value">{stats.totalCountries}</div>
          <div className="stat-label">Countries</div>
          <div className="stat-detail">
            Showing {viewMode === "density" ? "density" : "population"} data
          </div>
        </div>

        {/* Average Value */}
        <div className="stat-card">
          <div className="stat-value">{formatValue(stats.averageValue)}</div>
          <div className="stat-label">Average {valueLabel}</div>
          <div className="stat-detail">
            Median: {formatValue(stats.medianValue)}
          </div>
        </div>

        {/* Highest Value */}
        <div className="stat-card stat-card-highlight">
          <div className="stat-value">{formatValue(stats.maxValue)}</div>
          <div className="stat-label">Highest {valueLabel}</div>
          <div className="stat-detail">
            {stats.maxCountry?.name || "N/A"}
          </div>
        </div>

        {/* Lowest Value */}
        <div className="stat-card">
          <div className="stat-value">{formatValue(stats.minValue)}</div>
          <div className="stat-label">Lowest {valueLabel}</div>
          <div className="stat-detail">
            {stats.minCountry?.name || "N/A"}
          </div>
        </div>
      </div>

      {/* Last Updated Time */}
      <div className="update-time">Last updated: {lastUpdatedTime}</div>

      {/* Detailed Information about Extreme Countries */}
      {stats.maxCountry && (
        <div
          style={{
            marginTop: "15px",
            padding: "12px",
            background: "#fff3e0",
            borderRadius: "6px",
            fontSize: "14px",
            color: "#555",
          }}
        >
          <strong style={{ color: "#e65100" }}>
            {viewMode === "density" ? "Most Dense" : "Most Populous"}:{" "}
          </strong>
          {stats.maxCountry.name} with {formatFullValue(stats.maxValue)}
          {viewMode === "density" && (
            <span>
              {" "}
              (Population: {formatPopulationShort(stats.maxCountry.population)})
            </span>
          )}
        </div>
      )}
    </div>
  );
}


