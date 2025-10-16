import type { Earthquake, DepthFilter, RegionZoom } from "../types/earthquake";

export function getDepthColor(depth: number): string {
  if (depth < 70) return "#FF5722"; // Shallow - red
  if (depth < 300) return "#FF9800"; // Intermediate - orange
  return "#2196F3"; // Deep - blue
}

export function getDepthLabel(depth: number): string {
  if (depth < 70) return "Shallow";
  if (depth < 300) return "Intermediate";
  return "Deep";
}

export function getMagnitudeSize(magnitude: number): number {
  // Marker radius based on magnitude
  return Math.max(magnitude * 2, 4);
}

export function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatTimeAgo(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

export function filterEarthquakesByDepth(
  earthquakes: Earthquake[],
  depthFilter: DepthFilter
): Earthquake[] {
  if (depthFilter === "all") return earthquakes;
  
  return earthquakes.filter((eq) => {
    if (depthFilter === "shallow") return eq.depth < 70;
    if (depthFilter === "intermediate") return eq.depth >= 70 && eq.depth < 300;
    if (depthFilter === "deep") return eq.depth >= 300;
    return true;
  });
}

export function filterEarthquakesByMagnitude(
  earthquakes: Earthquake[],
  minMagnitude: number
): Earthquake[] {
  return earthquakes.filter((eq) => eq.magnitude >= minMagnitude);
}

export function calculateStats(earthquakes: Earthquake[]) {
  if (earthquakes.length === 0) {
    return {
      total: 0,
      averageMagnitude: 0,
      strongest: null,
      mostRecent: null,
    };
  }

  const total = earthquakes.length;
  const averageMagnitude =
    earthquakes.reduce((sum, eq) => sum + eq.magnitude, 0) / total;
  
  const strongest = earthquakes.reduce((max, eq) =>
    eq.magnitude > max.magnitude ? eq : max
  );

  const mostRecent = earthquakes.reduce((latest, eq) =>
    eq.time > latest.time ? eq : latest
  );

  return {
    total,
    averageMagnitude: parseFloat(averageMagnitude.toFixed(2)),
    strongest,
    mostRecent,
  };
}

export const REGION_ZOOMS: RegionZoom[] = [
  { name: "Global", coordinates: [0, 20], zoom: 1 },
  { name: "California", coordinates: [-119, 37], zoom: 4 },
  { name: "Japan", coordinates: [138, 36], zoom: 4 },
  { name: "Indonesia", coordinates: [118, -2], zoom: 4 },
  { name: "Chile", coordinates: [-71, -33], zoom: 4 },
  { name: "Ring of Fire", coordinates: [150, 10], zoom: 2 },
  { name: "Mediterranean", coordinates: [20, 38], zoom: 4 },
];

export function isRecentEarthquake(timestamp: number, hours: number = 24): boolean {
  const now = Date.now();
  const diff = now - timestamp;
  return diff < hours * 3600000;
}

