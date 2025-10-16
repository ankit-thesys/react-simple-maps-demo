import type {
  AirQualityData,
  OpenWeatherAQResponse,
  MonitoringStation,
} from "../types/airquality";

// OpenWeather API Configuration
const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY || "";
const BASE_URL = "http://api.openweathermap.org/data/2.5/air_pollution";

// Pre-defined monitoring stations across US, Europe, India, and China
export const MONITORING_STATIONS: MonitoringStation[] = [
  // United States (16 cities)
  { id: "us-nyc", name: "New York", coordinates: [-74.006, 40.7128], region: "US", country: "USA" },
  { id: "us-la", name: "Los Angeles", coordinates: [-118.2437, 34.0522], region: "US", country: "USA" },
  { id: "us-chicago", name: "Chicago", coordinates: [-87.6298, 41.8781], region: "US", country: "USA" },
  { id: "us-houston", name: "Houston", coordinates: [-95.3698, 29.7604], region: "US", country: "USA" },
  { id: "us-phoenix", name: "Phoenix", coordinates: [-112.074, 33.4484], region: "US", country: "USA" },
  { id: "us-philly", name: "Philadelphia", coordinates: [-75.1652, 39.9526], region: "US", country: "USA" },
  { id: "us-sa", name: "San Antonio", coordinates: [-98.4936, 29.4241], region: "US", country: "USA" },
  { id: "us-sd", name: "San Diego", coordinates: [-117.1611, 32.7157], region: "US", country: "USA" },
  { id: "us-dallas", name: "Dallas", coordinates: [-96.797, 32.7767], region: "US", country: "USA" },
  { id: "us-sj", name: "San Jose", coordinates: [-121.8863, 37.3382], region: "US", country: "USA" },
  { id: "us-austin", name: "Austin", coordinates: [-97.7431, 30.2672], region: "US", country: "USA" },
  { id: "us-jax", name: "Jacksonville", coordinates: [-81.6557, 30.3322], region: "US", country: "USA" },
  { id: "us-seattle", name: "Seattle", coordinates: [-122.3321, 47.6062], region: "US", country: "USA" },
  { id: "us-denver", name: "Denver", coordinates: [-104.9903, 39.7392], region: "US", country: "USA" },
  { id: "us-dc", name: "Washington DC", coordinates: [-77.0369, 38.9072], region: "US", country: "USA" },
  { id: "us-boston", name: "Boston", coordinates: [-71.0589, 42.3601], region: "US", country: "USA" },

  // Europe (14 cities)
  { id: "eu-london", name: "London", coordinates: [-0.1276, 51.5074], region: "Europe", country: "UK" },
  { id: "eu-paris", name: "Paris", coordinates: [2.3522, 48.8566], region: "Europe", country: "France" },
  { id: "eu-berlin", name: "Berlin", coordinates: [13.405, 52.52], region: "Europe", country: "Germany" },
  { id: "eu-madrid", name: "Madrid", coordinates: [-3.7038, 40.4168], region: "Europe", country: "Spain" },
  { id: "eu-rome", name: "Rome", coordinates: [12.4964, 41.9028], region: "Europe", country: "Italy" },
  { id: "eu-amsterdam", name: "Amsterdam", coordinates: [4.9041, 52.3676], region: "Europe", country: "Netherlands" },
  { id: "eu-brussels", name: "Brussels", coordinates: [4.3517, 50.8503], region: "Europe", country: "Belgium" },
  { id: "eu-vienna", name: "Vienna", coordinates: [16.3738, 48.2082], region: "Europe", country: "Austria" },
  { id: "eu-stockholm", name: "Stockholm", coordinates: [18.0686, 59.3293], region: "Europe", country: "Sweden" },
  { id: "eu-warsaw", name: "Warsaw", coordinates: [21.0122, 52.2297], region: "Europe", country: "Poland" },
  { id: "eu-athens", name: "Athens", coordinates: [23.7275, 37.9838], region: "Europe", country: "Greece" },
  { id: "eu-lisbon", name: "Lisbon", coordinates: [-9.1393, 38.7223], region: "Europe", country: "Portugal" },
  { id: "eu-prague", name: "Prague", coordinates: [14.4378, 50.0755], region: "Europe", country: "Czech Republic" },
  { id: "eu-munich", name: "Munich", coordinates: [11.5820, 48.1351], region: "Europe", country: "Germany" },

  // India (10 cities)
  { id: "in-delhi", name: "Delhi", coordinates: [77.1025, 28.7041], region: "India", country: "India" },
  { id: "in-mumbai", name: "Mumbai", coordinates: [72.8777, 19.076], region: "India", country: "India" },
  { id: "in-bangalore", name: "Bangalore", coordinates: [77.5946, 12.9716], region: "India", country: "India" },
  { id: "in-kolkata", name: "Kolkata", coordinates: [88.3639, 22.5726], region: "India", country: "India" },
  { id: "in-chennai", name: "Chennai", coordinates: [80.2707, 13.0827], region: "India", country: "India" },
  { id: "in-hyderabad", name: "Hyderabad", coordinates: [78.4867, 17.385], region: "India", country: "India" },
  { id: "in-ahmedabad", name: "Ahmedabad", coordinates: [72.5714, 23.0225], region: "India", country: "India" },
  { id: "in-pune", name: "Pune", coordinates: [73.8567, 18.5204], region: "India", country: "India" },
  { id: "in-jaipur", name: "Jaipur", coordinates: [75.7873, 26.9124], region: "India", country: "India" },
  { id: "in-lucknow", name: "Lucknow", coordinates: [80.9462, 26.8467], region: "India", country: "India" },

  // China (10 cities)
  { id: "cn-beijing", name: "Beijing", coordinates: [116.4074, 39.9042], region: "China", country: "China" },
  { id: "cn-shanghai", name: "Shanghai", coordinates: [121.4737, 31.2304], region: "China", country: "China" },
  { id: "cn-guangzhou", name: "Guangzhou", coordinates: [113.2644, 23.1291], region: "China", country: "China" },
  { id: "cn-shenzhen", name: "Shenzhen", coordinates: [114.0579, 22.5431], region: "China", country: "China" },
  { id: "cn-chengdu", name: "Chengdu", coordinates: [104.0668, 30.5728], region: "China", country: "China" },
  { id: "cn-hangzhou", name: "Hangzhou", coordinates: [120.1551, 30.2741], region: "China", country: "China" },
  { id: "cn-wuhan", name: "Wuhan", coordinates: [114.3055, 30.5928], region: "China", country: "China" },
  { id: "cn-xian", name: "Xi'an", coordinates: [108.9398, 34.3416], region: "China", country: "China" },
  { id: "cn-tianjin", name: "Tianjin", coordinates: [117.3616, 39.3434], region: "China", country: "China" },
  { id: "cn-nanjing", name: "Nanjing", coordinates: [118.7969, 32.0603], region: "China", country: "China" },
];

// Fetch current air quality data for a single location
export async function fetchCurrentAirQuality(
  lat: number,
  lon: number
): Promise<OpenWeatherAQResponse> {
  try {
    const url = `${BASE_URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch air quality data: ${response.statusText}`);
    }

    const data: OpenWeatherAQResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching current air quality:", error);
    throw error;
  }
}

// Fetch historical air quality data for a single location
export async function fetchHistoricalAirQuality(
  lat: number,
  lon: number,
  startTimestamp: number, // UNIX timestamp in seconds
  endTimestamp: number // UNIX timestamp in seconds
): Promise<OpenWeatherAQResponse> {
  try {
    const url = `${BASE_URL}/history?lat=${lat}&lon=${lon}&start=${startTimestamp}&end=${endTimestamp}&appid=${API_KEY}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch historical air quality data: ${response.statusText}`);
    }

    const data: OpenWeatherAQResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching historical air quality:", error);
    throw error;
  }
}

// Fetch air quality data for multiple stations with rate limiting awareness
export async function fetchBatchAirQuality(
  stations: MonitoringStation[]
): Promise<AirQualityData[]> {
  const results: AirQualityData[] = [];

  // Batch requests with small delays to respect rate limits
  for (let i = 0; i < stations.length; i++) {
    const station = stations[i];
    
    try {
      const response = await fetchCurrentAirQuality(
        station.coordinates[1], // latitude
        station.coordinates[0]  // longitude
      );

      // Convert OpenWeather response to our AirQualityData format
      if (response.list && response.list.length > 0) {
        const item = response.list[0];
        results.push({
          id: station.id,
          stationName: station.name,
          coordinates: station.coordinates,
          aqi: item.main.aqi,
          timestamp: item.dt * 1000, // Convert to milliseconds
          pollutants: item.components,
          region: station.region,
        });
      }

      // Small delay to avoid rate limiting (every 10 requests)
      if ((i + 1) % 10 === 0) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    } catch (error) {
      console.error(`Error fetching data for ${station.name}:`, error);
      // Continue with other stations even if one fails
    }
  }

  return results;
}

// Fetch historical data for a single station with timeline snapshots
export async function fetchStationTimeline(
  station: MonitoringStation,
  startDate: Date,
  endDate: Date
): Promise<AirQualityData[]> {
  try {
    const startTimestamp = Math.floor(startDate.getTime() / 1000);
    const endTimestamp = Math.floor(endDate.getTime() / 1000);

    const response = await fetchHistoricalAirQuality(
      station.coordinates[1], // latitude
      station.coordinates[0], // longitude
      startTimestamp,
      endTimestamp
    );

    // Convert all historical items to AirQualityData
    return response.list.map((item) => ({
      id: `${station.id}-${item.dt}`,
      stationName: station.name,
      coordinates: station.coordinates,
      aqi: item.main.aqi,
      timestamp: item.dt * 1000, // Convert to milliseconds
      pollutants: item.components,
      region: station.region,
    }));
  } catch (error) {
    console.error(`Error fetching timeline for ${station.name}:`, error);
    return [];
  }
}

// Fetch historical batch data for multiple stations
export async function fetchBatchTimeline(
  stations: MonitoringStation[],
  startDate: Date,
  endDate: Date
): Promise<Map<string, AirQualityData[]>> {
  const timelineData = new Map<string, AirQualityData[]>();

  for (let i = 0; i < stations.length; i++) {
    const station = stations[i];
    
    try {
      const data = await fetchStationTimeline(station, startDate, endDate);
      timelineData.set(station.id, data);

      // Delay to respect rate limits (every 5 requests for historical data)
      if ((i + 1) % 5 === 0) {
        await new Promise(resolve => setTimeout(resolve, 1500));
      }
    } catch (error) {
      console.error(`Error fetching timeline for ${station.name}:`, error);
    }
  }

  return timelineData;
}

