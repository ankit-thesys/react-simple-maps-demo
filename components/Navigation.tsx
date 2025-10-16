"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const demos = [
  { name: "Home", path: "/" },
  { name: "Basic Map", path: "/basic" },
  { name: "Interactive", path: "/interactive" },
  { name: "Choropleth", path: "/choropleth" },
  { name: "Markers", path: "/markers" },
  { name: "Zoom & Pan", path: "/zoom" },
  { name: "Projections", path: "/projections" },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="nav">
      <h1>React Simple Maps Demo</h1>
      <div className="nav-links">
        {demos.map((demo) => (
          <Link
            key={demo.path}
            href={demo.path}
            className={`nav-link ${pathname === demo.path ? "active" : ""}`}
          >
            {demo.name}
          </Link>
        ))}
      </div>
    </nav>
  );
}

