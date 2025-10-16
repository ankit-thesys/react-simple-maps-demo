import { Marker } from "react-simple-maps";
import type { AirQualityData } from "@/lib/types/airquality";
import { getAQIColor, getHeatmapRadius, getHeatmapOpacity } from "@/lib/utils/airquality-helpers";

interface HeatmapOverlayProps {
  data: AirQualityData[];
  intensity: number;
}

export default function HeatmapOverlay({ data, intensity }: HeatmapOverlayProps) {
  if (intensity === 0) return null;

  return (
    <>
      {data.map((station) => {
        const color = getAQIColor(station.aqi);
        const radius = getHeatmapRadius(station.aqi, intensity);
        const opacity = getHeatmapOpacity(station.aqi, intensity);

        // Create multiple concentric circles for gradient effect
        return (
          <Marker key={`heatmap-${station.id}`} coordinates={station.coordinates}>
            {/* Outer circle - largest, most transparent */}
            <circle
              r={radius * 1.5}
              fill={color}
              fillOpacity={opacity * 0.2}
              pointerEvents="none"
            />
            {/* Middle circle */}
            <circle
              r={radius}
              fill={color}
              fillOpacity={opacity * 0.4}
              pointerEvents="none"
            />
            {/* Inner circle - smallest, most opaque */}
            <circle
              r={radius * 0.5}
              fill={color}
              fillOpacity={opacity * 0.6}
              pointerEvents="none"
            />
          </Marker>
        );
      })}
    </>
  );
}

