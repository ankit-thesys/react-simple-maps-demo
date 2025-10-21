/**
 * Type definitions for Population Density Heat Map
 * 
 * This file contains all TypeScript interfaces for handling population data
 * from the REST Countries API and our internal data structures.
 */

/**
 * REST Countries API Response Structure
 * 
 * The REST Countries API returns country data in a specific format.
 * We extract only the fields we need for our visualization.
 */
export interface CountryAPIResponse {
  name: {
    common: string;      // Common name (e.g., "United States")
    official: string;    // Official name (e.g., "United States of America")
  };
  population: number;    // Total population
  area: number;          // Total area in km²
  region: string;        // Continent/region (e.g., "Asia", "Europe")
  subregion?: string;    // Sub-region (e.g., "Southern Asia")
  capital?: string[];    // Array of capital cities
  flags: {
    png: string;         // Flag image URL (PNG)
    svg: string;         // Flag image URL (SVG)
  };
  cca2: string;          // 2-letter country code (e.g., "US")
  cca3: string;          // 3-letter country code (e.g., "USA")
  latlng?: [number, number]; // [latitude, longitude]
}

/**
 * Processed Population Data
 * 
 * This is our internal data structure after processing the API response.
 * We calculate population density and normalize names for map matching.
 */
export interface PopulationData {
  id: string;                    // Unique identifier (cca3 code)
  name: string;                  // Country name (common name)
  officialName: string;          // Official country name
  population: number;            // Total population
  area: number;                  // Total area in km²
  density: number;               // Population density (people per km²)
  region: string;                // Continent/region
  subregion?: string;            // Sub-region
  capital?: string;              // Primary capital city
  flagUrl: string;               // Flag image URL
  coordinates?: [number, number]; // [longitude, latitude] for markers
}

/**
 * View Mode
 * 
 * Toggle between visualizing population density or total population
 */
export type ViewMode = "density" | "population";

/**
 * Region Filter
 * 
 * Filter countries by continent/region
 */
export type RegionFilter = "all" | "Africa" | "Americas" | "Asia" | "Europe" | "Oceania";

/**
 * Statistics Summary
 * 
 * Calculated statistics for the current view and filter settings
 */
export interface PopulationStatistics {
  totalCountries: number;
  minValue: number;
  maxValue: number;
  averageValue: number;
  medianValue: number;
  minCountry?: PopulationData;
  maxCountry?: PopulationData;
}

/**
 * Region Zoom Configuration
 * 
 * Predefined zoom settings for quick navigation to different regions
 */
export interface RegionZoom {
  name: string;
  region: RegionFilter;
  coordinates: [number, number]; // [longitude, latitude]
  zoom: number;
}


