import type { TimelineRange } from "@/lib/types/airquality";
import { formatDate } from "@/lib/utils/airquality-helpers";

interface TimelineControlsProps {
  dateRange: TimelineRange;
  setDateRange: (range: TimelineRange) => void;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  speed: 1 | 2 | 4;
  setSpeed: (speed: 1 | 2 | 4) => void;
  currentTimestamp: number;
  timestamps: number[];
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
  onStepBackward: () => void;
  onStepForward: () => void;
  isLoading: boolean;
}

export default function TimelineControls({
  dateRange,
  setDateRange,
  isPlaying,
  setIsPlaying,
  speed,
  setSpeed,
  currentTimestamp,
  timestamps,
  currentIndex,
  setCurrentIndex,
  onStepBackward,
  onStepForward,
  isLoading,
}: TimelineControlsProps) {
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const index = parseInt(e.target.value);
    setCurrentIndex(index);
  };

  const progress = timestamps.length > 0 ? (currentIndex / (timestamps.length - 1)) * 100 : 0;

  return (
    <div className="timeline-controls">
      <div className="timeline-header">
        <div className="timeline-date-range">
          <label>
            <strong>Historical Data Range:</strong>
          </label>
          <div className="timeline-range-buttons">
            <button
              className={`timeline-range-btn ${dateRange === 7 ? "active" : ""}`}
              onClick={() => setDateRange(7)}
              disabled={isLoading}
            >
              7 Days
            </button>
            <button
              className={`timeline-range-btn ${dateRange === 14 ? "active" : ""}`}
              onClick={() => setDateRange(14)}
              disabled={isLoading}
            >
              14 Days
            </button>
            <button
              className={`timeline-range-btn ${dateRange === 30 ? "active" : ""}`}
              onClick={() => setDateRange(30)}
              disabled={isLoading}
            >
              30 Days
            </button>
          </div>
        </div>

        <div className="timeline-current-date">
          <strong>Current Date:</strong> {formatDate(currentTimestamp)}
        </div>
      </div>

      <div className="timeline-slider-container">
        <button
          className="timeline-step-btn"
          onClick={onStepBackward}
          disabled={currentIndex === 0 || timestamps.length === 0}
          title="Step Backward"
        >
          ⏮
        </button>

        <button
          className="timeline-play-btn"
          onClick={() => setIsPlaying(!isPlaying)}
          disabled={timestamps.length === 0}
          title={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? "⏸" : "▶"}
        </button>

        <div className="timeline-slider-wrapper">
          <input
            type="range"
            min="0"
            max={Math.max(0, timestamps.length - 1)}
            value={currentIndex}
            onChange={handleSliderChange}
            className="timeline-slider"
            disabled={timestamps.length === 0}
          />
          <div
            className="timeline-progress"
            style={{ width: `${progress}%` }}
          />
          <div className="timeline-markers">
            {timestamps.length > 0 && timestamps.map((_, index) => {
              // Show marker every 4 steps
              if (index % 4 === 0 || index === timestamps.length - 1) {
                return (
                  <div
                    key={index}
                    className="timeline-marker"
                    style={{ left: `${(index / (timestamps.length - 1)) * 100}%` }}
                  />
                );
              }
              return null;
            })}
          </div>
        </div>

        <button
          className="timeline-step-btn"
          onClick={onStepForward}
          disabled={currentIndex >= timestamps.length - 1 || timestamps.length === 0}
          title="Step Forward"
        >
          ⏭
        </button>

        <div className="timeline-speed-control">
          <label>Speed:</label>
          <div className="speed-buttons">
            <button
              className={`speed-btn ${speed === 1 ? "active" : ""}`}
              onClick={() => setSpeed(1)}
            >
              1x
            </button>
            <button
              className={`speed-btn ${speed === 2 ? "active" : ""}`}
              onClick={() => setSpeed(2)}
            >
              2x
            </button>
            <button
              className={`speed-btn ${speed === 4 ? "active" : ""}`}
              onClick={() => setSpeed(4)}
            >
              4x
            </button>
          </div>
        </div>
      </div>

      {timestamps.length > 0 && (
        <div className="timeline-info">
          <span>
            Step {currentIndex + 1} of {timestamps.length}
          </span>
          <span style={{ marginLeft: "20px", color: "#666" }}>
            {timestamps.length > 1 && `(${Math.round((timestamps[1] - timestamps[0]) / 3600000)}h intervals)`}
          </span>
        </div>
      )}

      {isLoading && (
        <div className="timeline-loading">
          Loading historical data...
        </div>
      )}
    </div>
  );
}

