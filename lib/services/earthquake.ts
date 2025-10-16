import type { USGSResponse, Earthquake, TimeRange } from "../types/earthquake";

const USGS_BASE_URL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary";

const TIME_RANGE_ENDPOINTS: Record<TimeRange, string> = {
  hour: `${USGS_BASE_URL}/all_hour.geojson`,
  day: `${USGS_BASE_URL}/all_day.geojson`,
  week: `${USGS_BASE_URL}/all_week.geojson`,
  month: `${USGS_BASE_URL}/all_month.geojson`,
};

export async function fetchEarthquakes(
  timeRange: TimeRange = "day"
): Promise<Earthquake[]> {
  try {
    const response = await fetch(TIME_RANGE_ENDPOINTS[timeRange]);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch earthquakes: ${response.statusText}`);
    }

    const data: USGSResponse = await response.json();

    return data.features.map((feature) => ({
      id: feature.id,
      magnitude: feature.properties.mag,
      place: feature.properties.place,
      time: feature.properties.time,
      coordinates: [feature.geometry.coordinates[0], feature.geometry.coordinates[1]],
      depth: feature.geometry.coordinates[2],
      url: feature.properties.url,
      felt: feature.properties.felt,
      tsunami: feature.properties.tsunami,
      type: feature.properties.type,
      status: feature.properties.status,
      updated: feature.properties.updated,
    }));
  } catch (error) {
    console.error("Error fetching earthquake data:", error);
    throw error;
  }
}

export async function fetchSignificantEarthquakes(): Promise<Earthquake[]> {
  try {
    const response = await fetch(
      `${USGS_BASE_URL}/significant_week.geojson`
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch significant earthquakes: ${response.statusText}`
      );
    }

    const data: USGSResponse = await response.json();

    return data.features.map((feature) => ({
      id: feature.id,
      magnitude: feature.properties.mag,
      place: feature.properties.place,
      time: feature.properties.time,
      coordinates: [feature.geometry.coordinates[0], feature.geometry.coordinates[1]],
      depth: feature.geometry.coordinates[2],
      url: feature.properties.url,
      felt: feature.properties.felt,
      tsunami: feature.properties.tsunami,
      type: feature.properties.type,
      status: feature.properties.status,
      updated: feature.properties.updated,
    }));
  } catch (error) {
    console.error("Error fetching significant earthquake data:", error);
    throw error;
  }
}

