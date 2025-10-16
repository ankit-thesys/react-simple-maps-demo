import type { RegionType, PollutantType } from "@/lib/types/airquality";

interface FilterControlsProps {
  region: RegionType | "all";
  setRegion: (region: RegionType | "all") => void;
  minAQI: number;
  setMinAQI: (aqi: number) => void;
  pollutant: PollutantType;
  setPollutant: (pollutant: PollutantType) => void;
  showOnlyUnhealthy: boolean;
  setShowOnlyUnhealthy: (show: boolean) => void;
  heatmapIntensity: number;
  setHeatmapIntensity: (intensity: number) => void;
  onRefresh: () => void;
  isLoading: boolean;
}

export default function FilterControls({
  region,
  setRegion,
  minAQI,
  setMinAQI,
  pollutant,
  setPollutant,
  showOnlyUnhealthy,
  setShowOnlyUnhealthy,
  heatmapIntensity,
  setHeatmapIntensity,
  onRefresh,
  isLoading,
}: FilterControlsProps) {
  return (
    <div className="filter-controls">
      <div className="filter-group">
        <label htmlFor="region-select">
          <strong>Region:</strong>
        </label>
        <select
          id="region-select"
          value={region}
          onChange={(e) => setRegion(e.target.value as RegionType | "all")}
          className="filter-select"
        >
          <option value="all">All Regions</option>
          <option value="US">United States</option>
          <option value="Europe">Europe</option>
          <option value="India">India</option>
          <option value="China">China</option>
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="aqi-slider">
          <strong>Min AQI: {minAQI}</strong>
        </label>
        <input
          id="aqi-slider"
          type="range"
          min="1"
          max="5"
          step="1"
          value={minAQI}
          onChange={(e) => setMinAQI(parseInt(e.target.value))}
          className="filter-slider"
        />
        <div className="slider-labels">
          <span>1 (Good)</span>
          <span>5 (Hazardous)</span>
        </div>
      </div>

      <div className="filter-group">
        <label htmlFor="pollutant-select">
          <strong>Focus Pollutant:</strong>
        </label>
        <select
          id="pollutant-select"
          value={pollutant}
          onChange={(e) => setPollutant(e.target.value as PollutantType)}
          className="filter-select"
        >
          <option value="all">All Pollutants</option>
          <option value="pm2_5">PM2.5</option>
          <option value="pm10">PM10</option>
          <option value="no2">NO₂ (Nitrogen Dioxide)</option>
          <option value="so2">SO₂ (Sulfur Dioxide)</option>
          <option value="o3">O₃ (Ozone)</option>
          <option value="co">CO (Carbon Monoxide)</option>
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="heatmap-intensity">
          <strong>Heatmap Intensity: {heatmapIntensity}%</strong>
        </label>
        <input
          id="heatmap-intensity"
          type="range"
          min="0"
          max="100"
          step="10"
          value={heatmapIntensity}
          onChange={(e) => setHeatmapIntensity(parseInt(e.target.value))}
          className="filter-slider"
        />
        <div className="slider-labels">
          <span>0%</span>
          <span>100%</span>
        </div>
      </div>

      <div className="filter-group">
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={showOnlyUnhealthy}
            onChange={(e) => setShowOnlyUnhealthy(e.target.checked)}
          />
          <span>Show Only Unhealthy (AQI ≥ 3)</span>
        </label>
      </div>

      <button
        onClick={onRefresh}
        disabled={isLoading}
        className="refresh-btn"
      >
        {isLoading ? "Loading..." : "🔄 Refresh Data"}
      </button>
    </div>
  );
}

