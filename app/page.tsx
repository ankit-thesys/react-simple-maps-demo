"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div className="container">
      <div className="nav">
        <h1>React Simple Maps Demo</h1>
        <p style={{ marginBottom: "20px", color: "#666" }}>
          Explore the capabilities of react-simple-maps library
        </p>
      </div>

      <div className="demo-section">
        <h2>Welcome to React Simple Maps Demo! 🗺️</h2>
        <p>
          This demo project showcases various features and capabilities of the{" "}
          <code>react-simple-maps</code> library. Explore different examples to
          understand how to create beautiful, interactive SVG maps in your React
          applications.
        </p>
      </div>

      <div className="demo-section">
        <h2>Available Demos</h2>
        <div style={{ display: "grid", gap: "20px", marginTop: "20px" }}>
          <DemoCard
            title="1. Basic World Map"
            description="A simple world map showing all countries. Perfect starting point to understand the basics of react-simple-maps."
            link="/basic"
          />
          <DemoCard
            title="2. Interactive Map"
            description="Clickable countries with hover effects, tooltips, and selection states. Learn how to add interactivity to your maps."
            link="/interactive"
          />
          <DemoCard
            title="3. Choropleth Map"
            description="Color-coded map based on data values. Great for visualizing statistical data geographically."
            link="/choropleth"
          />
          <DemoCard
            title="4. Markers & Annotations"
            description="Add custom markers and annotations to highlight specific locations on your map."
            link="/markers"
          />
          <DemoCard
            title="5. Zoom & Pan"
            description="Interactive zoom and pan controls for exploring maps in detail."
            link="/zoom"
          />
          <DemoCard
            title="6. Custom Projections"
            description="Explore different map projection types and understand how they change the map appearance."
            link="/projections"
          />
          <DemoCard
            title="7. 🌍 Real-Time Earthquake Dashboard"
            description="Live earthquake data from USGS with interactive filtering, statistics, and detailed earthquake information. Showcases real-world API integration."
            link="/earthquake"
            highlight={true}
          />
          <DemoCard
            title="8. 🌫️ Air Quality Dashboard with Timeline"
            description="Interactive air quality visualization with historical playback (7-30 days), heatmap overlay, and detailed pollutant tracking across 50+ cities worldwide. Features animated timeline for exploring pollution patterns over time."
            link="/airquality"
            highlight={true}
          />
        </div>
      </div>

      <div className="info-panel">
        <h3>Quick Start Guide</h3>
        <p>
          Click on any demo above to see the implementation. Each demo includes
          code examples and explanations to help you understand how to use
          react-simple-maps in your own projects.
        </p>
      </div>
    </div>
  );
}

function DemoCard({
  title,
  description,
  link,
  highlight = false,
}: {
  title: string;
  description: string;
  link: string;
  highlight?: boolean;
}) {
  return (
    <Link href={link}>
      <div
        style={{
          padding: "20px",
          background: highlight ? "#fff3e0" : "white",
          border: highlight ? "2px solid #ff9800" : "2px solid #e0e0e0",
          borderRadius: "8px",
          cursor: "pointer",
          transition: "all 0.3s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = highlight ? "#ff9800" : "#007bff";
          e.currentTarget.style.boxShadow = highlight
            ? "0 4px 12px rgba(255, 152, 0, 0.3)"
            : "0 4px 12px rgba(0, 123, 255, 0.2)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = highlight ? "#ff9800" : "#e0e0e0";
          e.currentTarget.style.boxShadow = "none";
        }}
      >
        <h3
          style={{
            marginBottom: "10px",
            color: highlight ? "#e65100" : "#007bff",
          }}
        >
          {title}
        </h3>
        <p style={{ margin: 0, color: "#666", lineHeight: "1.6" }}>
          {description}
        </p>
        {highlight && (
          <div
            style={{
              marginTop: "10px",
              padding: "4px 8px",
              background: "#ff9800",
              color: "white",
              borderRadius: "4px",
              fontSize: "12px",
              fontWeight: "bold",
              display: "inline-block",
            }}
          >
            NEW - Real-World Data
          </div>
        )}
      </div>
    </Link>
  );
}

