// OpenWeather Air Pollution API Types

export interface AirQualityData {
  id: string;
  stationName: string;
  coordinates: [number, number]; // [longitude, latitude]
  aqi: number; // 1-5 scale (OpenWeather)
  timestamp: number; // UNIX timestamp in milliseconds
  pollutants: {
    co: number; // Carbon monoxide, μg/m³
    no: number; // Nitrogen monoxide, μg/m³
    no2: number; // Nitrogen dioxide, μg/m³
    o3: number; // Ozone, μg/m³
    so2: number; // Sulphur dioxide, μg/m³
    pm2_5: number; // Fine particles matter, μg/m³
    pm10: number; // Coarse particulate matter, μg/m³
    nh3: number; // Ammonia, μg/m³
  };
  region: RegionType;
}

export interface OpenWeatherComponents {
  co: number;
  no: number;
  no2: number;
  o3: number;
  so2: number;
  pm2_5: number;
  pm10: number;
  nh3: number;
}

export interface OpenWeatherAQItem {
  main: {
    aqi: number; // 1-5 scale
  };
  components: OpenWeatherComponents;
  dt: number; // UNIX timestamp in seconds
}

export interface OpenWeatherAQResponse {
  coord: {
    lon: number;
    lat: number;
  };
  list: OpenWeatherAQItem[];
}

export interface MonitoringStation {
  id: string;
  name: string;
  coordinates: [number, number]; // [longitude, latitude]
  region: RegionType;
  country: string;
}

export type AQILevel = 1 | 2 | 3 | 4 | 5;

export type RegionType = "US" | "Europe" | "India" | "China";

export type TimelineRange = 7 | 14 | 30;

export type PollutantType = "all" | "pm2_5" | "pm10" | "no2" | "so2" | "o3" | "co";

export interface AirQualityFilters {
  region: RegionType | "all";
  minAQI: number;
  pollutant: PollutantType;
  showOnlyUnhealthy: boolean;
  heatmapIntensity: number;
}

export interface TimelineState {
  selectedTimestamp: number;
  isPlaying: boolean;
  speed: 1 | 2 | 4;
  dateRange: TimelineRange;
  timestamps: number[];
  currentIndex: number;
}

export interface RegionZoom {
  name: string;
  coordinates: [number, number];
  zoom: number;
}

export interface AQIStats {
  total: number;
  averageAQI: number;
  bestLocation: AirQualityData | null;
  worstLocation: AirQualityData | null;
  dominantPollutant: string;
  unhealthyCount: number;
}

