import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "React Simple Maps Demo",
  description: "Exploring react-simple-maps capabilities with Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

