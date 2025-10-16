# 🌍 Real-Time Earthquake Dashboard

## Overview

An interactive earthquake visualization dashboard built with **react-simple-maps** and the **USGS Earthquake API**. This demonstrates real-world API integration and showcases the full capabilities of react-simple-maps for data visualization.

## Live Features

### 📊 Real-Time Data
- Fetches live earthquake data from USGS Earthquake API
- Auto-refreshes every 5 minutes
- Displays earthquakes from the last hour, day, week, or month
- Shows "last updated" timestamp

### 🎛️ Interactive Filters
- **Magnitude Filter**: Slider to set minimum magnitude (0.0 - 7.0+)
- **Time Range**: Hour / Day / Week / Month
- **Depth Filter**: All / Shallow (0-70km) / Intermediate (70-300km) / Deep (>300km)
- **Region Quick Zoom**: Global, California, Japan, Indonesia, Chile, Ring of Fire, Mediterranean

### 📈 Statistics Panel
- Total earthquake count
- Average magnitude
- Strongest earthquake (magnitude + location)
- Most recent earthquake (time + location)

### 🗺️ Interactive Map
- **Markers**: Each earthquake is a circular marker
- **Size**: Based on magnitude (larger = stronger)
- **Color**: Based on depth
  - Red (#FF5722): Shallow (0-70km)
  - Orange (#FF9800): Intermediate (70-300km)
  - Blue (#2196F3): Deep (>300km)
- **Animation**: Recent earthquakes (last 24h) have pulsing effect
- **Hover**: Shows quick info tooltip
- **Click**: Opens detailed information panel
- **Zoom & Pan**: Full ZoomableGroup controls

### 📋 Details Panel
When clicking an earthquake marker, shows:
- Exact magnitude
- Full location description
- Date and time
- Depth (km) with classification
- Exact coordinates (lat/long)
- Felt reports (if available)
- Tsunami warning (if applicable)
- Event type and status
- Direct link to USGS details page

## Technical Implementation

### Architecture
```
/lib/types/earthquake.ts          - TypeScript type definitions
/lib/services/earthquake.ts       - USGS API integration
/lib/utils/earthquake-helpers.ts  - Helper functions (colors, formatting, filtering)
/components/earthquake/
  - StatsPanel.tsx                - Statistics display
  - FilterControls.tsx            - Filter UI components
  - EarthquakeDetails.tsx         - Detailed info panel
/app/earthquake/page.tsx          - Main dashboard page
```

### React-Simple-Maps Usage

✅ **Proper Usage Demonstrated:**
- `ComposableMap` for SVG container
- `ZoomableGroup` for pan/zoom controls
- `Geographies` & `Geography` for world map background
- `Marker` for earthquake points (sized and colored dynamically)
- Event handlers: `onMouseEnter`, `onMouseLeave`, `onClick`
- Dynamic styling based on data
- CSS animations (not library-dependent)

### State Management
- `useState` for filters, selections, data
- `useCallback` for memoized data fetching
- `useMemo` for filtered data calculations
- `useEffect` for auto-refresh intervals

### API Integration
```typescript
// USGS Earthquake API Endpoints
https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson
https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson
https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson
https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson
```

### Type Safety
- Full TypeScript type definitions for USGS API responses
- Type-safe helper functions
- No `any` types used
- Complete IntelliSense support

## Key Features by react-simple-maps Capability

| Capability | Implementation |
|------------|---------------|
| Marker Plotting | ✅ Dynamic earthquake markers |
| Size Scaling | ✅ Markers sized by magnitude |
| Color Coding | ✅ Color by depth (red/orange/blue) |
| Interactive Events | ✅ Hover tooltips + Click details |
| Zoom & Pan | ✅ ZoomableGroup with position state |
| Custom Styling | ✅ Dynamic opacity + CSS animations |
| Real Data | ✅ USGS API integration |
| Filters | ✅ Magnitude, time, depth, region |

## CSS Animations
```css
@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.7; transform: scale(1.1); }
}
```

Applied to earthquakes from the last 24 hours for visual emphasis.

## Performance Optimizations
- `useMemo` for filtered data (prevents unnecessary re-filtering)
- `useCallback` for fetch function (stable reference)
- CSS-based animations (no JavaScript animation loops)
- Auto-refresh with cleanup (prevents memory leaks)

## Responsive Design
- Mobile-friendly layout
- Collapsible details panel on mobile
- Touch-friendly controls
- Responsive statistics grid

## User Experience
1. **Clear Visual Hierarchy**: Stats → Filters → Map → Legend
2. **Instant Feedback**: Hover effects, loading states
3. **Error Handling**: Graceful error messages if API fails
4. **Accessibility**: Semantic HTML, keyboard navigation
5. **Information Density**: Progressive disclosure (hover → click)

## What This Demonstrates

### For Learning react-simple-maps:
✅ Proper component usage  
✅ Event handling patterns  
✅ Dynamic marker rendering  
✅ State management with maps  
✅ CSS styling best practices  

### For Portfolio/Interviews:
✅ Real API integration  
✅ TypeScript proficiency  
✅ State management patterns  
✅ Performance optimization  
✅ Responsive design  
✅ Error handling  
✅ Code organization  

### For Real-World Applications:
✅ Data visualization  
✅ Interactive filtering  
✅ Real-time updates  
✅ User-friendly UI/UX  

## Future Enhancements (Ideas)

1. **Tectonic Plate Overlay**: Add plate boundaries as GeoJSON lines
2. **Historical Playback**: Animate earthquakes over time
3. **Comparison Mode**: Compare different time periods
4. **Notifications**: Browser notifications for major quakes (M>6.0)
5. **Sharing**: Generate shareable links for specific earthquakes
6. **Export**: Download filtered data as CSV/JSON
7. **Clustering**: Group nearby earthquakes at low zoom levels
8. **3D Depth Visualization**: Show depth with perspective

## Resources

- **USGS Earthquake API**: https://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php
- **React Simple Maps**: https://www.react-simple-maps.io/
- **GitHub Repo**: https://github.com/ankit-thesys/react-simple-maps-demo

---

Built to showcase react-simple-maps capabilities with real-world data! 🚀

