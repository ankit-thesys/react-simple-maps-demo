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
- **🌫️ Air Quality Dashboard with Timeline**: Interactive air quality visualization with:
  - Real-time AQI data from 50+ cities worldwide (US, Europe, India, China)
  - Historical playback with animated timeline (7-30 days)
  - Interactive heatmap overlay showing pollution spread
  - Detailed pollutant breakdown (PM2.5, PM10, NO₂, SO₂, O₃, CO)
  - Health recommendations based on AQI levels
  - Play/Pause animation with speed control (1x, 2x, 4x)
  - Region-specific filtering and zoom
  - Statistics panel with best/worst locations
  - Auto-refresh every 30 minutes

## APIs Used

- **USGS Earthquake API**: Real-time earthquake data (no authentication required)
  - Endpoint: `https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/`
- **OpenWeather Air Pollution API**: Real-time and historical air quality data (free tier available)
  - Endpoint: `http://api.openweathermap.org/data/2.5/air_pollution`
  - Get your free API key at: https://openweathermap.org/api

## Environment Setup

For the Air Quality Dashboard, you need to set up an OpenWeather API key:

1. Sign up for a free account at [OpenWeather](https://openweathermap.org/api)
2. Get your API key from the dashboard
3. Create a `.env.local` file in the root directory:
   ```bash
   cp .env.example .env.local
   ```
4. Add your API key to `.env.local`:
   ```
   NEXT_PUBLIC_OPENWEATHER_API_KEY=your_actual_api_key_here
   ```

**Note**: The free tier includes 1,000 API calls per day, which is sufficient for this dashboard.

## Learn More

- [React Simple Maps Documentation](https://www.react-simple-maps.io/)
- [Next.js Documentation](https://nextjs.org/docs)
- [USGS Earthquake API](https://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php)

