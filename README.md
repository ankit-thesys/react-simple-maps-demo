# React Simple Maps Demo

This is a demonstration project for exploring the capabilities of [react-simple-maps](https://www.react-simple-maps.io/) library with Next.js.

## Getting Started

First, install dependencies:

```bash
pnpm install
```

Then, run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Features Demonstrated

- **Basic World Map**: Simple world map rendering
- **Interactive Map**: Clickable countries with hover effects
- **Choropleth Map**: Color-coded map based on data values
- **Markers**: Adding custom markers to specific coordinates
- **Zoom & Pan**: Interactive zoom and pan functionality
- **Custom Projections**: Different map projection types
- **🌍 Real-Time Earthquake Dashboard**: Live earthquake data from USGS API with:
  - Real-time data fetching and auto-refresh (5 minutes)
  - Interactive filtering (magnitude, time range, depth)
  - Statistics panel with metrics
  - Detailed earthquake information panel
  - Regional zoom controls
  - Color-coded markers by depth
  - Size-based markers by magnitude
  - Pulsing animation for recent earthquakes

## APIs Used

- **USGS Earthquake API**: Real-time earthquake data (no authentication required)
  - Endpoint: `https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/`

## Learn More

- [React Simple Maps Documentation](https://www.react-simple-maps.io/)
- [Next.js Documentation](https://nextjs.org/docs)
- [USGS Earthquake API](https://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php)

