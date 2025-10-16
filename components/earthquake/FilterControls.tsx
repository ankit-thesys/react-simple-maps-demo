import type { TimeRange, DepthFilter } from "@/lib/types/earthquake";

interface FilterControlsProps {
  minMagnitude: number;
  setMinMagnitude: (value: number) => void;
  timeRange: TimeRange;
  setTimeRange: (value: TimeRange) => void;
  depthFilter: DepthFilter;
  setDepthFilter: (value: DepthFilter) => void;
  onRefresh: () => void;
  isLoading: boolean;
}

export default function FilterControls({
  minMagnitude,
  setMinMagnitude,
  timeRange,
  setTimeRange,
  depthFilter,
  setDepthFilter,
  onRefresh,
  isLoading,
}: FilterControlsProps) {
  return (
    <div className="filter-controls">
      <div className="filter-group">
        <label htmlFor="time-range">
          <strong>Time Range:</strong>
        </label>
        <select
          id="time-range"
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value as TimeRange)}
          className="filter-select"
        >
          <option value="hour">Last Hour</option>
          <option value="day">Last Day</option>
          <option value="week">Last Week</option>
          <option value="month">Last Month</option>
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="magnitude">
          <strong>Min Magnitude: {minMagnitude.toFixed(1)}</strong>
        </label>
        <input
          id="magnitude"
          type="range"
          min="0"
          max="7"
          step="0.5"
          value={minMagnitude}
          onChange={(e) => setMinMagnitude(parseFloat(e.target.value))}
          className="filter-slider"
        />
        <div className="slider-labels">
          <span>0.0</span>
          <span>7.0+</span>
        </div>
      </div>

      <div className="filter-group">
        <label>
          <strong>Depth Filter:</strong>
        </label>
        <div className="filter-buttons">
          <button
            className={`filter-btn ${depthFilter === "all" ? "active" : ""}`}
            onClick={() => setDepthFilter("all")}
          >
            All
          </button>
          <button
            className={`filter-btn ${depthFilter === "shallow" ? "active" : ""}`}
            onClick={() => setDepthFilter("shallow")}
            style={{ borderColor: "#FF5722" }}
          >
            Shallow
          </button>
          <button
            className={`filter-btn ${depthFilter === "intermediate" ? "active" : ""}`}
            onClick={() => setDepthFilter("intermediate")}
            style={{ borderColor: "#FF9800" }}
          >
            Intermediate
          </button>
          <button
            className={`filter-btn ${depthFilter === "deep" ? "active" : ""}`}
            onClick={() => setDepthFilter("deep")}
            style={{ borderColor: "#2196F3" }}
          >
            Deep
          </button>
        </div>
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

