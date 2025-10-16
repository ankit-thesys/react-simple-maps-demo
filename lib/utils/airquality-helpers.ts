import type {
  AirQualityData,
  AQIStats,
  PollutantType,
  RegionType,
  RegionZoom,
} from "../types/airquality";

// AQI Color Scale (OpenWeather uses 1-5 scale)
export function getAQIColor(aqi: number): string {
  switch (aqi) {
    case 1:
      return "#4CAF50"; // Good - Green
    case 2:
      return "#FFEB3B"; // Moderate - Yellow
    case 3:
      return "#FF9800"; // Unhealthy for Sensitive - Orange
    case 4:
      return "#F44336"; // Unhealthy - Red
    case 5:
      return "#9C27B0"; // Very Unhealthy - Purple
    default:
      return "#9E9E9E"; // Unknown - Gray
  }
}

// Get AQI category label
export function getAQILabel(aqi: number): string {
  switch (aqi) {
    case 1:
      return "Good";
    case 2:
      return "Moderate";
    case 3:
      return "Unhealthy for Sensitive Groups";
    case 4:
      return "Unhealthy";
    case 5:
      return "Very Unhealthy";
    default:
      return "Unknown";
  }
}

// Get health recommendations based on AQI level
export function getHealthRecommendation(aqi: number): string {
  switch (aqi) {
    case 1:
      return "Air quality is satisfactory. Air pollution poses little or no risk. Enjoy outdoor activities!";
    case 2:
      return "Air quality is acceptable. However, unusually sensitive people should consider limiting prolonged outdoor exertion.";
    case 3:
      return "Members of sensitive groups may experience health effects. The general public is less likely to be affected. Children, elderly, and people with respiratory conditions should limit prolonged outdoor exertion.";
    case 4:
      return "Some members of the general public may experience health effects; members of sensitive groups may experience more serious health effects. Everyone should limit prolonged outdoor exertion.";
    case 5:
      return "Health alert: The risk of health effects is increased for everyone. Avoid outdoor activities. Everyone should limit outdoor exertion.";
    default:
      return "Air quality data unavailable.";
  }
}

// Get pollutant level description
export function getPollutantLevel(value: number, pollutant: PollutantType): string {
  // Simplified categorization based on WHO guidelines and common thresholds
  const thresholds: Record<PollutantType, { low: number; moderate: number; high: number }> = {
    all: { low: 0, moderate: 0, high: 0 },
    pm2_5: { low: 12, moderate: 35, high: 55 },
    pm10: { low: 20, moderate: 50, high: 150 },
    no2: { low: 40, moderate: 100, high: 200 },
    so2: { low: 20, moderate: 80, high: 250 },
    o3: { low: 60, moderate: 120, high: 180 },
    co: { low: 4000, moderate: 9000, high: 15000 },
  };

  if (pollutant === "all") return "N/A";

  const threshold = thresholds[pollutant];
  if (value <= threshold.low) return "Low";
  if (value <= threshold.moderate) return "Moderate";
  if (value <= threshold.high) return "High";
  return "Very High";
}

// Calculate average AQI and statistics
export function calculateAverageAQI(data: AirQualityData[]): AQIStats {
  if (data.length === 0) {
    return {
      total: 0,
      averageAQI: 0,
      bestLocation: null,
      worstLocation: null,
      dominantPollutant: "N/A",
      unhealthyCount: 0,
    };
  }

  const total = data.length;
  const averageAQI = data.reduce((sum, item) => sum + item.aqi, 0) / total;

  const bestLocation = data.reduce((best, item) =>
    item.aqi < best.aqi ? item : best
  );

  const worstLocation = data.reduce((worst, item) =>
    item.aqi > worst.aqi ? item : worst
  );

  // Count unhealthy locations (AQI >= 3)
  const unhealthyCount = data.filter((item) => item.aqi >= 3).length;

  // Find dominant pollutant across all data
  const pollutantTotals = {
    pm2_5: 0,
    pm10: 0,
    no2: 0,
    so2: 0,
    o3: 0,
    co: 0,
  };

  data.forEach((item) => {
    pollutantTotals.pm2_5 += item.pollutants.pm2_5;
    pollutantTotals.pm10 += item.pollutants.pm10;
    pollutantTotals.no2 += item.pollutants.no2;
    pollutantTotals.so2 += item.pollutants.so2;
    pollutantTotals.o3 += item.pollutants.o3;
    pollutantTotals.co += item.pollutants.co / 1000; // Normalize CO
  });

  const dominantPollutant = Object.entries(pollutantTotals).reduce((a, b) =>
    a[1] > b[1] ? a : b
  )[0];

  return {
    total,
    averageAQI: parseFloat(averageAQI.toFixed(2)),
    bestLocation,
    worstLocation,
    dominantPollutant: formatPollutantName(dominantPollutant),
    unhealthyCount,
  };
}

// Filter by AQI threshold
export function filterByAQIThreshold(
  data: AirQualityData[],
  minAQI: number
): AirQualityData[] {
  return data.filter((item) => item.aqi >= minAQI);
}

// Filter by region
export function filterByRegion(
  data: AirQualityData[],
  region: RegionType | "all"
): AirQualityData[] {
  if (region === "all") return data;
  return data.filter((item) => item.region === region);
}

// Filter by pollutant type
export function filterByPollutant(
  data: AirQualityData[],
  pollutant: PollutantType,
  threshold: number
): AirQualityData[] {
  if (pollutant === "all") return data;

  return data.filter((item) => {
    const value = item.pollutants[pollutant];
    return value >= threshold;
  });
}

// Generate timeline steps between two dates
export function generateTimelineSteps(
  startDate: Date,
  endDate: Date,
  stepHours: number = 6
): number[] {
  const timestamps: number[] = [];
  const stepMs = stepHours * 60 * 60 * 1000;
  let current = startDate.getTime();
  const end = endDate.getTime();

  while (current <= end) {
    timestamps.push(current);
    current += stepMs;
  }

  return timestamps;
}

// Format date/time
export function formatDateTime(timestamp: number): string {
  return new Date(timestamp).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Format date only
export function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// Format time ago
export function formatTimeAgo(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return formatDate(timestamp);
}

// Get marker size based on AQI
export function getMarkerSize(aqi: number): number {
  return Math.max(aqi * 2.5, 4);
}

// Check if AQI is unhealthy (3 or higher)
export function isUnhealthy(aqi: number): boolean {
  return aqi >= 3;
}

// Format pollutant name for display
export function formatPollutantName(pollutant: string): string {
  const names: Record<string, string> = {
    pm2_5: "PM2.5",
    pm10: "PM10",
    no2: "NO₂",
    so2: "SO₂",
    o3: "O₃",
    co: "CO",
    no: "NO",
    nh3: "NH₃",
  };
  return names[pollutant] || pollutant.toUpperCase();
}

// Region zoom coordinates
export const REGION_ZOOMS: RegionZoom[] = [
  { name: "Global", coordinates: [0, 20], zoom: 1 },
  { name: "United States", coordinates: [-95, 37], zoom: 3 },
  { name: "Europe", coordinates: [10, 50], zoom: 3 },
  { name: "India", coordinates: [78, 22], zoom: 4 },
  { name: "China", coordinates: [105, 35], zoom: 4 },
];

// Calculate heatmap radius based on AQI
export function getHeatmapRadius(aqi: number, intensity: number): number {
  return (aqi * 8 * intensity) / 100;
}

// Get heatmap opacity based on AQI and intensity
export function getHeatmapOpacity(aqi: number, intensity: number): number {
  return Math.min((aqi * 0.15 * intensity) / 100, 0.7);
}

// Find data by station ID
export function findDataByStation(
  data: AirQualityData[],
  stationId: string
): AirQualityData | undefined {
  return data.find((item) => item.id === stationId);
}

// Group data by timestamp for timeline
export function groupByTimestamp(
  data: AirQualityData[]
): Map<number, AirQualityData[]> {
  const grouped = new Map<number, AirQualityData[]>();

  data.forEach((item) => {
    const existing = grouped.get(item.timestamp) || [];
    existing.push(item);
    grouped.set(item.timestamp, existing);
  });

  return grouped;
}

// Get closest timestamp in array
export function getClosestTimestamp(
  target: number,
  timestamps: number[]
): number {
  if (timestamps.length === 0) return target;

  return timestamps.reduce((prev, curr) =>
    Math.abs(curr - target) < Math.abs(prev - target) ? curr : prev
  );
}

