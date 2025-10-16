import type { AirQualityData } from "@/lib/types/airquality";
import {
  getAQIColor,
  getAQILabel,
  getHealthRecommendation,
  getPollutantLevel,
  formatDateTime,
  formatPollutantName,
} from "@/lib/utils/airquality-helpers";

interface AirQualityDetailsProps {
  data: AirQualityData;
  onClose: () => void;
}

export default function AirQualityDetails({ data, onClose }: AirQualityDetailsProps) {
  const aqiColor = getAQIColor(data.aqi);
  const aqiLabel = getAQILabel(data.aqi);
  const healthRec = getHealthRecommendation(data.aqi);

  return (
    <div className="details-panel">
      <div className="details-header">
        <div>
          <h3>{data.stationName}</h3>
          <div className="details-coordinates">
            {data.coordinates[1].toFixed(4)}°N, {data.coordinates[0].toFixed(4)}°E
          </div>
        </div>
        <button onClick={onClose} className="close-btn">
          ✕
        </button>
      </div>

      <div className="details-body">
        <div className="aqi-section">
          <div className="aqi-badge" style={{ backgroundColor: aqiColor }}>
            <div className="aqi-value">{data.aqi}</div>
            <div className="aqi-label">{aqiLabel}</div>
          </div>
        </div>

        <div className="details-section">
          <h4>Health Recommendations</h4>
          <p className="health-rec">{healthRec}</p>
        </div>

        <div className="details-section">
          <h4>Pollutant Levels</h4>
          <div className="pollutants-grid">
            <div className="pollutant-item">
              <div className="pollutant-name">{formatPollutantName("pm2_5")}</div>
              <div className="pollutant-value">
                {data.pollutants.pm2_5.toFixed(1)} μg/m³
              </div>
              <div className="pollutant-level">
                {getPollutantLevel(data.pollutants.pm2_5, "pm2_5")}
              </div>
            </div>

            <div className="pollutant-item">
              <div className="pollutant-name">{formatPollutantName("pm10")}</div>
              <div className="pollutant-value">
                {data.pollutants.pm10.toFixed(1)} μg/m³
              </div>
              <div className="pollutant-level">
                {getPollutantLevel(data.pollutants.pm10, "pm10")}
              </div>
            </div>

            <div className="pollutant-item">
              <div className="pollutant-name">{formatPollutantName("no2")}</div>
              <div className="pollutant-value">
                {data.pollutants.no2.toFixed(1)} μg/m³
              </div>
              <div className="pollutant-level">
                {getPollutantLevel(data.pollutants.no2, "no2")}
              </div>
            </div>

            <div className="pollutant-item">
              <div className="pollutant-name">{formatPollutantName("so2")}</div>
              <div className="pollutant-value">
                {data.pollutants.so2.toFixed(1)} μg/m³
              </div>
              <div className="pollutant-level">
                {getPollutantLevel(data.pollutants.so2, "so2")}
              </div>
            </div>

            <div className="pollutant-item">
              <div className="pollutant-name">{formatPollutantName("o3")}</div>
              <div className="pollutant-value">
                {data.pollutants.o3.toFixed(1)} μg/m³
              </div>
              <div className="pollutant-level">
                {getPollutantLevel(data.pollutants.o3, "o3")}
              </div>
            </div>

            <div className="pollutant-item">
              <div className="pollutant-name">{formatPollutantName("co")}</div>
              <div className="pollutant-value">
                {data.pollutants.co.toFixed(0)} μg/m³
              </div>
              <div className="pollutant-level">
                {getPollutantLevel(data.pollutants.co, "co")}
              </div>
            </div>
          </div>
        </div>

        <div className="details-section">
          <h4>Measurement Info</h4>
          <div className="info-item">
            <strong>Timestamp:</strong> {formatDateTime(data.timestamp)}
          </div>
          <div className="info-item">
            <strong>Region:</strong> {data.region}
          </div>
        </div>
      </div>
    </div>
  );
}

