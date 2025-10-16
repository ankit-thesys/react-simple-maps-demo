import type { Earthquake } from "@/lib/types/earthquake";
import { calculateStats, formatTimeAgo } from "@/lib/utils/earthquake-helpers";

interface StatsPanelProps {
  earthquakes: Earthquake[];
  lastUpdated: number;
}

export default function StatsPanel({ earthquakes, lastUpdated }: StatsPanelProps) {
  const stats = calculateStats(earthquakes);

  return (
    <div className="stats-panel">
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{stats.total}</div>
          <div className="stat-label">Total Earthquakes</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-value">{stats.averageMagnitude}</div>
          <div className="stat-label">Average Magnitude</div>
        </div>

        {stats.strongest && (
          <div className="stat-card stat-card-highlight">
            <div className="stat-value">{stats.strongest.magnitude.toFixed(1)}</div>
            <div className="stat-label">Strongest Quake</div>
            <div className="stat-detail">{stats.strongest.place}</div>
          </div>
        )}

        {stats.mostRecent && (
          <div className="stat-card">
            <div className="stat-value">{formatTimeAgo(stats.mostRecent.time)}</div>
            <div className="stat-label">Most Recent</div>
            <div className="stat-detail">{stats.mostRecent.place}</div>
          </div>
        )}
      </div>

      <div className="update-time">
        Last updated: {formatTimeAgo(lastUpdated)}
      </div>
    </div>
  );
}

