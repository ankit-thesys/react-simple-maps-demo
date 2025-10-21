/**
 * Population Data Service
 * 
 * This service fetches country data from the REST Countries API
 * and processes it for our population density heat map visualization.
 * 
 * API Documentation: https://restcountries.com/
 */

import type { CountryAPIResponse, PopulationData } from "../types/population";

/**
 * REST Countries API endpoint
 * 
 * We use the /all endpoint to fetch data for all countries.
 * The fields parameter limits the response to only the data we need.
 */
const REST_COUNTRIES_API = "https://restcountries.com/v3.1/all";

/**
 * Fields to fetch from the API
 * 
 * By specifying fields, we reduce the response size and improve performance.
 */
const FIELDS = "name,population,area,region,subregion,capital,flags,cca2,cca3,latlng";

/**
 * Country Name Mapping
 * 
 * The REST Countries API uses different names than the TopoJSON file.
 * This mapping ensures we can match countries correctly on the map.
 */
const COUNTRY_NAME_MAPPING: Record<string, string> = {
  "United States": "United States of America",
  "USA": "United States of America",
  "United Kingdom": "United Kingdom",
  "Russia": "Russia",
  "Russian Federation": "Russia",
  "South Korea": "South Korea",
  "Korea": "South Korea",
  "North Korea": "North Korea",
  "Democratic Republic of the Congo": "Dem. Rep. Congo",
  "Congo": "Congo",
  "Tanzania": "Tanzania",
  "Côte d'Ivoire": "Côte d'Ivoire",
  "Ivory Coast": "Côte d'Ivoire",
  "Bosnia and Herzegovina": "Bosnia and Herz.",
  "Central African Republic": "Central African Rep.",
  "Dominican Republic": "Dominican Rep.",
  "Equatorial Guinea": "Eq. Guinea",
  "South Sudan": "S. Sudan",
  "Solomon Islands": "Solomon Is.",
  "Falkland Islands": "Falkland Is.",
};

/**
 * Fetch all countries from REST Countries API
 * 
 * This function fetches country data from the REST Countries API,
 * calculates population density, and returns processed data.
 * 
 * @returns Promise<PopulationData[]> Array of processed country data
 * @throws Error if API request fails
 */
export async function fetchAllCountries(): Promise<PopulationData[]> {
  try {
    // Fetch data from REST Countries API
    const url = `${REST_COUNTRIES_API}?fields=${FIELDS}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(
        `Failed to fetch country data: ${response.status} ${response.statusText}`
      );
    }

    const data: CountryAPIResponse[] = await response.json();

    // Process each country and calculate population density
    const processedData: PopulationData[] = data
      .map((country) => {
        // Calculate population density (people per km²)
        // Skip countries with no area data to avoid division by zero
        const density = country.area > 0 ? country.population / country.area : 0;

        // Get primary capital city (first in array)
        const capital = country.capital && country.capital.length > 0
          ? country.capital[0]
          : undefined;

        // Convert lat/lng to [longitude, latitude] for react-simple-maps
        const coordinates = country.latlng
          ? ([country.latlng[1], country.latlng[0]] as [number, number])
          : undefined;

        return {
          id: country.cca3,
          name: country.name.common,
          officialName: country.name.official,
          population: country.population,
          area: country.area,
          density,
          region: country.region,
          subregion: country.subregion,
          capital,
          flagUrl: country.flags.svg || country.flags.png,
          coordinates,
        };
      })
      // Filter out countries with invalid data
      .filter((country) => {
        return (
          country.population > 0 &&
          country.area > 0 &&
          country.density > 0
        );
      })
      // Sort by population (descending) for easier processing
      .sort((a, b) => b.population - a.population);

    console.log(`Fetched ${processedData.length} countries from REST Countries API`);
    return processedData;
  } catch (error) {
    console.error("Error fetching country data:", error);
    throw error;
  }
}

/**
 * Get normalized country name for map matching
 * 
 * This function normalizes country names to match the names
 * used in the TopoJSON geography file.
 * 
 * @param name Country name from API or map
 * @returns Normalized country name
 */
export function getNormalizedCountryName(name: string): string {
  return COUNTRY_NAME_MAPPING[name] || name;
}

/**
 * Match country data by name
 * 
 * Attempts to find country data by matching the name from the map
 * with the name from the API. Handles various name formats.
 * 
 * @param mapName Country name from the TopoJSON file
 * @param countries Array of country data
 * @returns Matched country data or undefined
 */
export function matchCountryByName(
  mapName: string,
  countries: PopulationData[]
): PopulationData | undefined {
  // Try exact match first
  let match = countries.find(
    (c) => c.name === mapName || c.officialName === mapName
  );

  if (match) return match;

  // Try normalized name
  const normalizedMapName = getNormalizedCountryName(mapName);
  match = countries.find(
    (c) =>
      c.name === normalizedMapName || c.officialName === normalizedMapName
  );

  if (match) return match;

  // Try partial match (contains)
  match = countries.find(
    (c) =>
      c.name.includes(mapName) ||
      mapName.includes(c.name) ||
      c.officialName.includes(mapName) ||
      mapName.includes(c.officialName)
  );

  return match;
}


