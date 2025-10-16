import type { Earthquake } from "@/lib/types/earthquake";
import { formatDate, getDepthColor, getDepthLabel } from "@/lib/utils/earthquake-helpers";

interface EarthquakeDetailsProps {
  earthquake: Earthquake | null;
  onClose: () => void;
}

export default function EarthquakeDetails({
  earthquake,
  onClose,
}: EarthquakeDetailsProps) {
  if (!earthquake) return null;

  return (
    <div className="earthquake-details">
      <div className="details-header">
        <h3>Earthquake Details</h3>
        <button onClick={onClose} className="close-btn">
          ×
        </button>
      </div>

      <div className="details-content">
        <div className="detail-item">
          <span className="detail-label">Magnitude:</span>
          <span className="detail-value magnitude-badge">
            {earthquake.magnitude.toFixed(1)}
          </span>
        </div>

        <div className="detail-item">
          <span className="detail-label">Location:</span>
          <span className="detail-value">{earthquake.place}</span>
        </div>

        <div className="detail-item">
          <span className="detail-label">Date & Time:</span>
          <span className="detail-value">{formatDate(earthquake.time)}</span>
        </div>

        <div className="detail-item">
          <span className="detail-label">Depth:</span>
          <span
            className="detail-value depth-badge"
            style={{ color: getDepthColor(earthquake.depth) }}
          >
            {earthquake.depth.toFixed(1)} km ({getDepthLabel(earthquake.depth)})
          </span>
        </div>

        <div className="detail-item">
          <span className="detail-label">Coordinates:</span>
          <span className="detail-value">
            {earthquake.coordinates[1].toFixed(4)}°N,{" "}
            {earthquake.coordinates[0].toFixed(4)}°E
          </span>
        </div>

        {earthquake.felt !== undefined && earthquake.felt > 0 && (
          <div className="detail-item">
            <span className="detail-label">Felt Reports:</span>
            <span className="detail-value">
              {earthquake.felt} {earthquake.felt === 1 ? "person" : "people"}
            </span>
          </div>
        )}

        {earthquake.tsunami === 1 && (
          <div className="detail-item tsunami-warning">
            <span className="detail-label">⚠️ Tsunami:</span>
            <span className="detail-value">Warning Issued</span>
          </div>
        )}

        <div className="detail-item">
          <span className="detail-label">Type:</span>
          <span className="detail-value">{earthquake.type}</span>
        </div>

        <div className="detail-item">
          <span className="detail-label">Status:</span>
          <span className="detail-value status-badge">{earthquake.status}</span>
        </div>
      </div>

      <div className="details-footer">
        <a
          href={earthquake.url}
          target="_blank"
          rel="noopener noreferrer"
          className="usgs-link"
        >
          View on USGS →
        </a>
      </div>
    </div>
  );
}

