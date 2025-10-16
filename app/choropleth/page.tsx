"use client";

import { useState } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { scaleQuantile } from "d3-scale";
import Navigation from "@/components/Navigation";

const geoUrl =
  "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

// Sample data: population by country (in millions)
const data: Record<string, number> = {
  "China": 1444,
  "India": 1393,
  "United States of America": 331,
  "Indonesia": 276,
  "Pakistan": 225,
  "Brazil": 214,
  "Nigeria": 211,
  "Bangladesh": 166,
  "Russia": 146,
  "Mexico": 130,
  "Japan": 125,
  "Ethiopia": 118,
  "Philippines": 111,
  "Egypt": 104,
  "Vietnam": 98,
  "Germany": 83,
  "Turkey": 85,
  "Iran": 85,
  "Thailand": 70,
  "United Kingdom": 68,
  "France": 65,
  "Italy": 60,
  "South Africa": 60,
  "Tanzania": 61,
  "Myanmar": 55,
  "South Korea": 52,
  "Colombia": 51,
  "Kenya": 54,
  "Spain": 47,
  "Argentina": 45,
  "Algeria": 44,
  "Sudan": 44,
  "Ukraine": 44,
  "Uganda": 47,
  "Iraq": 41,
  "Poland": 38,
  "Canada": 38,
  "Morocco": 37,
  "Saudi Arabia": 35,
  "Uzbekistan": 34,
  "Peru": 33,
  "Angola": 33,
  "Malaysia": 33,
  "Mozambique": 32,
  "Ghana": 31,
  "Yemen": 30,
  "Nepal": 30,
  "Venezuela": 28,
  "Madagascar": 28,
  "Australia": 26,
  "North Korea": 26,
  "Cameroon": 27,
  "Niger": 25,
  "Sri Lanka": 22,
  "Burkina Faso": 21,
  "Mali": 21,
  "Romania": 19,
  "Malawi": 19,
  "Chile": 19,
  "Kazakhstan": 19,
  "Zambia": 19,
  "Guatemala": 18,
  "Ecuador": 18,
  "Syria": 18,
  "Netherlands": 17,
  "Senegal": 17,
  "Cambodia": 17,
  "Chad": 17,
  "Somalia": 16,
  "Zimbabwe": 15,
  "Guinea": 13,
  "Rwanda": 13,
  "Benin": 12,
  "Burundi": 12,
  "Tunisia": 12,
  "Bolivia": 12,
  "Belgium": 11,
  "Haiti": 11,
  "Cuba": 11,
  "South Sudan": 11,
  "Dominican Republic": 11,
  "Czech Republic": 10,
  "Greece": 10,
  "Jordan": 10,
  "Portugal": 10,
  "Azerbaijan": 10,
  "Sweden": 10,
  "Honduras": 10,
  "United Arab Emirates": 10,
  "Hungary": 10,
  "Tajikistan": 10,
  "Belarus": 9,
  "Austria": 9,
  "Papua New Guinea": 9,
  "Serbia": 9,
  "Israel": 9,
  "Switzerland": 9,
  "Togo": 8,
  "Sierra Leone": 8,
  "Laos": 7,
  "Paraguay": 7,
  "Bulgaria": 7,
  "Libya": 7,
  "Lebanon": 7,
  "Nicaragua": 7,
  "Kyrgyzstan": 7,
  "El Salvador": 6,
  "Turkmenistan": 6,
  "Singapore": 6,
  "Denmark": 6,
  "Finland": 6,
  "Congo": 6,
  "Slovakia": 5,
  "Norway": 5,
  "Oman": 5,
  "Palestine": 5,
  "Costa Rica": 5,
  "Liberia": 5,
  "Ireland": 5,
  "Central African Republic": 5,
  "New Zealand": 5,
  "Mauritania": 5,
  "Panama": 4,
  "Kuwait": 4,
  "Croatia": 4,
  "Moldova": 4,
  "Georgia": 4,
  "Eritrea": 4,
  "Uruguay": 3,
  "Bosnia and Herzegovina": 3,
  "Mongolia": 3,
  "Armenia": 3,
  "Jamaica": 3,
  "Qatar": 3,
  "Albania": 3,
  "Puerto Rico": 3,
  "Lithuania": 3,
  "Namibia": 3,
  "Gambia": 2,
  "Botswana": 2,
  "Gabon": 2,
  "Lesotho": 2,
  "North Macedonia": 2,
  "Slovenia": 2,
  "Guinea-Bissau": 2,
  "Latvia": 2,
  "Bahrain": 2,
  "Equatorial Guinea": 1,
  "Trinidad and Tobago": 1,
  "Estonia": 1,
  "Timor-Leste": 1,
  "Mauritius": 1,
  "Cyprus": 1,
  "Eswatini": 1,
  "Djibouti": 1,
  "Fiji": 1,
  "Réunion": 1,
  "Comoros": 1,
  "Guyana": 1,
  "Bhutan": 1,
  "Solomon Islands": 1,
  "Macao": 1,
  "Montenegro": 1,
  "Luxembourg": 1,
  "Suriname": 1,
  "Cabo Verde": 1,
  "Maldives": 1,
  "Malta": 1,
  "Brunei": 1,
  "Belize": 1,
  "Bahamas": 1,
  "Iceland": 1,
  "Vanuatu": 1,
  "Barbados": 1,
  "Sao Tome and Principe": 1,
  "Samoa": 1,
  "Saint Lucia": 1,
};

const colorScale = scaleQuantile<string>()
  .domain(Object.values(data))
  .range([
    "#ffedea",
    "#ffcec5",
    "#ffad9f",
    "#ff8a75",
    "#ff5533",
    "#e2492d",
    "#be3d26",
    "#9a311f",
    "#782618",
  ]);

export default function ChoroplethMapPage() {
  const [tooltip, setTooltip] = useState("");

  return (
    <div className="container">
      <Navigation />

      <div className="demo-section">
        <h2>Choropleth Map (Population Data)</h2>
        <p>
          A choropleth map uses different colors to represent data values for
          different geographic areas. This example shows world population by
          country, with darker colors indicating higher populations.
        </p>

        <div className="map-container">
          <ComposableMap
            projectionConfig={{
              scale: 147,
            }}
            width={800}
            height={400}
          >
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const countryName = geo.properties.name;
                  const population = data[countryName];
                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill={population ? colorScale(population) : "#F5F4F6"}
                      stroke="#FFFFFF"
                      strokeWidth={0.5}
                      onMouseEnter={() => {
                        setTooltip(
                          `${countryName}${population ? `: ${population}M people` : ": No data"}`
                        );
                      }}
                      onMouseLeave={() => {
                        setTooltip("");
                      }}
                      style={{
                        hover: {
                          fill: "#F53",
                          outline: "none",
                          cursor: "pointer",
                        },
                      }}
                    />
                  );
                })
              }
            </Geographies>
          </ComposableMap>

          {tooltip && (
            <div
              className="tooltip"
              style={{
                position: "fixed",
                pointerEvents: "none",
                background: "rgba(0, 0, 0, 0.8)",
                color: "white",
                padding: "8px 12px",
                borderRadius: "4px",
                fontSize: "14px",
              }}
            >
              {tooltip}
            </div>
          )}
        </div>

        <div className="legend">
          <h3>Population (millions)</h3>
          <div className="legend-items">
            <div className="legend-item">
              <div
                className="legend-color"
                style={{ background: "#ffedea" }}
              />
              <span>0-50M</span>
            </div>
            <div className="legend-item">
              <div
                className="legend-color"
                style={{ background: "#ffcec5" }}
              />
              <span>50-100M</span>
            </div>
            <div className="legend-item">
              <div
                className="legend-color"
                style={{ background: "#ffad9f" }}
              />
              <span>100-200M</span>
            </div>
            <div className="legend-item">
              <div
                className="legend-color"
                style={{ background: "#ff8a75" }}
              />
              <span>200-400M</span>
            </div>
            <div className="legend-item">
              <div
                className="legend-color"
                style={{ background: "#ff5533" }}
              />
              <span>400M+</span>
            </div>
            <div className="legend-item">
              <div
                className="legend-color"
                style={{ background: "#F5F4F6" }}
              />
              <span>No data</span>
            </div>
          </div>
        </div>

        <div className="info-panel" style={{ marginTop: "20px" }}>
          <h3>How It Works</h3>
          <ul style={{ marginLeft: "20px", color: "#555" }}>
            <li>Data is stored in a simple object mapping country names to values</li>
            <li>
              Using <code>d3-scale</code> to create a color scale from data values
            </li>
            <li>Each country is colored based on its data value</li>
            <li>Countries without data are shown in a neutral gray color</li>
          </ul>
        </div>

        <div className="info-panel" style={{ marginTop: "20px" }}>
          <h3>Code Snippet</h3>
          <pre
            style={{
              background: "#1e1e1e",
              color: "#d4d4d4",
              padding: "15px",
              borderRadius: "4px",
              overflow: "auto",
              fontSize: "13px",
            }}
          >
            {`import { scaleQuantile } from "d3-scale";

const data: Record<string, number> = {
  "China": 1444,
  "India": 1393,
  // ... more countries
};

const colorScale = scaleQuantile<string>()
  .domain(Object.values(data))
  .range(["#ffedea", "#ffcec5", "#ffad9f", "#ff8a75", "#ff5533"]);

<Geography
  fill={population ? colorScale(population) : "#F5F4F6"}
  // ... other props
/>`}
          </pre>
        </div>
      </div>
    </div>
  );
}

