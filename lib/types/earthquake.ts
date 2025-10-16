export interface Earthquake {
  id: string;
  magnitude: number;
  place: string;
  time: number;
  coordinates: [number, number];
  depth: number;
  url: string;
  felt?: number;
  tsunami: number;
  type: string;
  status: string;
  updated: number;
}

export interface USGSFeature {
  type: string;
  properties: {
    mag: number;
    place: string;
    time: number;
    updated: number;
    tz?: number;
    url: string;
    detail: string;
    felt?: number;
    cdi?: number;
    mmi?: number;
    alert?: string;
    status: string;
    tsunami: number;
    sig: number;
    net: string;
    code: string;
    ids: string;
    sources: string;
    types: string;
    nst?: number;
    dmin?: number;
    rms?: number;
    gap?: number;
    magType: string;
    type: string;
    title: string;
  };
  geometry: {
    type: string;
    coordinates: [number, number, number]; // [longitude, latitude, depth]
  };
  id: string;
}

export interface USGSResponse {
  type: string;
  metadata: {
    generated: number;
    url: string;
    title: string;
    status: number;
    api: string;
    count: number;
  };
  features: USGSFeature[];
  bbox: number[];
}

export type TimeRange = "hour" | "day" | "week" | "month";
export type DepthFilter = "all" | "shallow" | "intermediate" | "deep";

export interface EarthquakeFilters {
  minMagnitude: number;
  timeRange: TimeRange;
  depthFilter: DepthFilter;
}

export interface RegionZoom {
  name: string;
  coordinates: [number, number];
  zoom: number;
}

