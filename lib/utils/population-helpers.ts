/**
 * Population Density Helper Utilities
 * 
 * This file contains utility functions for:
 * - D3 color interpolation and scaling
 * - Data formatting (numbers, density, population)
 * - Statistical calculations
 * - Region filtering
 * 
 * These utilities are used throughout the population density visualization.
 */

import { scaleSequential, scaleLinear } from "d3-scale";
import type {
  PopulationData,
  PopulationStatistics,
  RegionFilter,
  ViewMode,
  RegionZoom,
} from "../types/population";

/**
 * Color Scale for Population Density
 * 
 * Uses D3's scaleSequential to create a smooth gradient from yellow to red.
 * This represents low to high population density.
 * 
 * D3 Interpolation: We create a custom interpolator that blends:
 * - Yellow (#FFFF00) for low density
 * - Orange (#FF8C00) for medium density  
 * - Red (#FF0000) for high density
 */

/**
 * Custom Yellow-Orange-Red Interpolator
 * 
 * This function takes a value between 0 and 1 and returns a color
 * along the yellow → orange → red spectrum.
 * 
 * @param t Value between 0 and 1
 * @returns RGB color string
 */
export function interpolateYellowOrangeRed(t: number): string {
  // Clamp t between 0 and 1
  t = Math.max(0, Math.min(1, t));
  
  // Define color stops
  // Yellow (255, 255, 100) → Orange (255, 140, 0) → Red (220, 0, 0)
  
  if (t < 0.5) {
    // Interpolate from yellow to orange (first half)
    const localT = t * 2; // Scale to 0-1
    const r = 255;
    const g = 255 - Math.round(115 * localT); // 255 → 140
    const b = 100 - Math.round(100 * localT); // 100 → 0
    return `rgb(${r}, ${g}, ${b})`;
  } else {
    // Interpolate from orange to red (second half)
    const localT = (t - 0.5) * 2; // Scale to 0-1
    const r = 255 - Math.round(35 * localT); // 255 → 220
    const g = 140 - Math.round(140 * localT); // 140 → 0
    const b = 0;
    return `rgb(${r}, ${g}, ${b})`;
  }
}

/**
 * Create Population Density Color Scale
 * 
 * Creates a D3 sequential scale that maps density values to colors.
 * 
 * @param minDensity Minimum density value in dataset
 * @param maxDensity Maximum density value in dataset
 * @returns D3 scale function
 */
export function createDensityColorScale(
  minDensity: number,
  maxDensity: number
) {
  return scaleSequential(interpolateYellowOrangeRed)
    .domain([minDensity, maxDensity]);
}

/**
 * Create Population Color Scale
 * 
 * Creates a D3 sequential scale that maps population values to colors.
 * Uses logarithmic scaling for better visualization of population ranges.
 * 
 * @param minPopulation Minimum population value in dataset
 * @param maxPopulation Maximum population value in dataset
 * @returns D3 scale function
 */
export function createPopulationColorScale(
  minPopulation: number,
  maxPopulation: number
) {
  // Use log scale for population since values range from thousands to billions
  const logScale = scaleLinear()
    .domain([Math.log10(minPopulation), Math.log10(maxPopulation)])
    .range([0, 1]);

  return (value: number) => {
    const t = logScale(Math.log10(value));
    return interpolateYellowOrangeRed(t);
  };
}

/**
 * Get Color for Density Value
 * 
 * Returns the appropriate color for a given density value.
 * 
 * @param density Population density (people per km²)
 * @param minDensity Minimum density in dataset
 * @param maxDensity Maximum density in dataset
 * @returns RGB color string
 */
export function getDensityColor(
  density: number,
  minDensity: number,
  maxDensity: number
): string {
  if (!density || density <= 0) {
    return "#E0E0E0"; // Gray for no data
  }
  
  const scale = createDensityColorScale(minDensity, maxDensity);
  return scale(density);
}

/**
 * Get Color for Population Value
 * 
 * Returns the appropriate color for a given population value.
 * 
 * @param population Total population
 * @param minPopulation Minimum population in dataset
 * @param maxPopulation Maximum population in dataset
 * @returns RGB color string
 */
export function getPopulationColor(
  population: number,
  minPopulation: number,
  maxPopulation: number
): string {
  if (!population || population <= 0) {
    return "#E0E0E0"; // Gray for no data
  }
  
  const scale = createPopulationColorScale(minPopulation, maxPopulation);
  return scale(population);
}

/**
 * Format Population Number
 * 
 * Formats large numbers with commas for readability.
 * Example: 1444000000 → "1,444,000,000"
 * 
 * @param num Population number
 * @returns Formatted string
 */
export function formatPopulation(num: number): string {
  return num.toLocaleString("en-US");
}

/**
 * Format Population Short
 * 
 * Formats population numbers with suffixes (M for million, B for billion).
 * Example: 1444000000 → "1.44B"
 * 
 * @param num Population number
 * @returns Formatted string
 */
export function formatPopulationShort(num: number): string {
  if (num >= 1_000_000_000) {
    return `${(num / 1_000_000_000).toFixed(2)}B`;
  } else if (num >= 1_000_000) {
    return `${(num / 1_000_000).toFixed(2)}M`;
  } else if (num >= 1_000) {
    return `${(num / 1_000).toFixed(2)}K`;
  }
  return num.toLocaleString("en-US");
}

/**
 * Format Density Number
 * 
 * Formats density with 1 decimal place and units.
 * Example: 419.8 → "419.8/km²"
 * 
 * @param density Population density (people per km²)
 * @returns Formatted string
 */
export function formatDensity(density: number): string {
  return `${density.toFixed(1)}/km²`;
}

/**
 * Format Area Number
 * 
 * Formats area with commas and units.
 * Example: 9596961 → "9,596,961 km²"
 * 
 * @param area Area in km²
 * @returns Formatted string
 */
export function formatArea(area: number): string {
  return `${area.toLocaleString("en-US")} km²`;
}

/**
 * Calculate Statistics
 * 
 * Calculates min, max, average, and median values for the current dataset.
 * 
 * @param countries Array of country data
 * @param viewMode Current view mode ("density" or "population")
 * @returns Statistics object
 */
export function calculateStatistics(
  countries: PopulationData[],
  viewMode: ViewMode
): PopulationStatistics {
  if (countries.length === 0) {
    return {
      totalCountries: 0,
      minValue: 0,
      maxValue: 0,
      averageValue: 0,
      medianValue: 0,
    };
  }

  // Get values based on view mode
  const values = countries.map((c) =>
    viewMode === "density" ? c.density : c.population
  );

  // Sort values for median calculation
  const sortedValues = [...values].sort((a, b) => a - b);

  // Calculate statistics
  const minValue = sortedValues[0];
  const maxValue = sortedValues[sortedValues.length - 1];
  const sum = values.reduce((acc, val) => acc + val, 0);
  const averageValue = sum / values.length;
  
  // Calculate median
  const middleIndex = Math.floor(sortedValues.length / 2);
  const medianValue =
    sortedValues.length % 2 === 0
      ? (sortedValues[middleIndex - 1] + sortedValues[middleIndex]) / 2
      : sortedValues[middleIndex];

  // Find countries with min/max values
  const minCountry = countries.find((c) =>
    viewMode === "density" ? c.density === minValue : c.population === minValue
  );
  const maxCountry = countries.find((c) =>
    viewMode === "density" ? c.density === maxValue : c.population === maxValue
  );

  return {
    totalCountries: countries.length,
    minValue,
    maxValue,
    averageValue,
    medianValue,
    minCountry,
    maxCountry,
  };
}

/**
 * Filter Countries by Region
 * 
 * Filters the country array based on the selected region.
 * 
 * @param countries Array of all countries
 * @param region Selected region filter
 * @returns Filtered array of countries
 */
export function filterByRegion(
  countries: PopulationData[],
  region: RegionFilter
): PopulationData[] {
  if (region === "all") {
    return countries;
  }
  
  return countries.filter((country) => country.region === region);
}

/**
 * Region Zoom Configurations
 * 
 * Predefined zoom settings for quick navigation to different world regions.
 * Coordinates are [longitude, latitude] and zoom is a multiplier.
 */
export const REGION_ZOOMS: RegionZoom[] = [
  {
    name: "World",
    region: "all",
    coordinates: [0, 20],
    zoom: 1,
  },
  {
    name: "Asia",
    region: "Asia",
    coordinates: [100, 35],
    zoom: 2,
  },
  {
    name: "Europe",
    region: "Europe",
    coordinates: [15, 55],
    zoom: 3,
  },
  {
    name: "Africa",
    region: "Africa",
    coordinates: [20, 0],
    zoom: 2,
  },
  {
    name: "Americas",
    region: "Americas",
    coordinates: [-80, 20],
    zoom: 2,
  },
  {
    name: "Oceania",
    region: "Oceania",
    coordinates: [135, -25],
    zoom: 3,
  },
];

/**
 * Get Legend Steps for Color Scale
 * 
 * Creates an array of values for displaying the color legend.
 * 
 * @param minValue Minimum value in dataset
 * @param maxValue Maximum value in dataset
 * @param steps Number of legend steps to generate
 * @returns Array of legend values
 */
export function getLegendSteps(
  minValue: number,
  maxValue: number,
  steps: number = 5
): number[] {
  const stepSize = (maxValue - minValue) / (steps - 1);
  return Array.from({ length: steps }, (_, i) => minValue + stepSize * i);
}


