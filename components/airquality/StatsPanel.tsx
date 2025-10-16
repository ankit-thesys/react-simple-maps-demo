import type { AirQualityData } from "@/lib/types/airquality";
import { calculateAverageAQI, formatTimeAgo } from "@/lib/utils/airquality-helpers";

interface StatsPanelProps {
  data: AirQualityData[];
  lastUpdated: number;
}

export default function StatsPanel({ data, lastUpdated }: StatsPanelProps) {
  const stats = calculateAverageAQI(data);

  return (
    <div className="stats-grid">
      <div className="stat-card">
        <div className="stat-label">Monitoring Stations</div>
        <div className="stat-value">{stats.total}</div>
      </div>

      <div className="stat-card">
        <div className="stat-label">Average AQI</div>
        <div className="stat-value">{stats.averageAQI.toFixed(1)}</div>
      </div>

      <div className="stat-card">
        <div className="stat-label">Best Air Quality</div>
        <div className="stat-value">
          {stats.bestLocation ? (
            <>
              <span style={{ fontSize: "18px", fontWeight: "bold" }}>
                {stats.bestLocation.stationName}
              </span>
              <div style={{ fontSize: "14px", color: "#4CAF50" }}>
                AQI: {stats.bestLocation.aqi}
              </div>
            </>
          ) : (
            "N/A"
          )}
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-label">Worst Air Quality</div>
        <div className="stat-value">
          {stats.worstLocation ? (
            <>
              <span style={{ fontSize: "18px", fontWeight: "bold" }}>
                {stats.worstLocation.stationName}
              </span>
              <div style={{ fontSize: "14px", color: "#F44336" }}>
                AQI: {stats.worstLocation.aqi}
              </div>
            </>
          ) : (
            "N/A"
          )}
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-label">Dominant Pollutant</div>
        <div className="stat-value">{stats.dominantPollutant}</div>
      </div>

      <div className="stat-card">
        <div className="stat-label">Unhealthy Locations</div>
        <div className="stat-value">
          {stats.unhealthyCount}
          {stats.unhealthyCount > 0 && (
            <div style={{ fontSize: "12px", color: "#F44336", marginTop: "4px" }}>
              ⚠️ Alert
            </div>
          )}
        </div>
      </div>

      <div className="stat-card" style={{ gridColumn: "span 2" }}>
        <div className="stat-label">Last Updated</div>
        <div className="stat-value" style={{ fontSize: "16px" }}>
          {formatTimeAgo(lastUpdated)}
        </div>
      </div>
    </div>
  );
}

