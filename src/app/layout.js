"use client";

import localFont from "next/font/local";
import "./globals.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect } from "react";

// Load custom fonts
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

// This component handles the client-side rendering
export default function RootLayout({ children }) {
  // Use useEffect to import Bootstrap JS and Font Awesome JS bundle only in the browser
  useEffect(() => {
    // Dynamically import Bootstrap JS and Font Awesome JS only on the client side
    import("bootstrap/dist/js/bootstrap.bundle.min.js");

    // Load Font Awesome kit dynamically
    const fontAwesomeScript = document.createElement("script");
    fontAwesomeScript.src = "https://kit.fontawesome.com/88716550fd.js";
    fontAwesomeScript.crossOrigin = "anonymous";
    document.head.appendChild(fontAwesomeScript);
  }, []);

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
      </body>
    </html>
  );
}
