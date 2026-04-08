import type { Metadata, Viewport } from "next";
import React from "react";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import WebVitals from "@/components/analytics/WebVitals";
import { AppProviders } from "./providers";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "SISO Platform",
  description: "Unified platform for client-base and partnerships",
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = {
  themeColor: "#0B0F1A",
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        {process.env.NODE_ENV === 'development' && (
          <script src="https://unpkg.com/react-scan/dist/auto.global.js" async />
        )}
        <link rel="preconnect" href="https://api.dicebear.com" crossOrigin="anonymous" />
        {/* Preload the most-used font weights so they're ready before CSS is parsed */}
        <link rel="preload" href="/fonts/CircularXX-Regular.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/CircularXX-Medium.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/InterDisplay-SemiBold.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen bg-black text-white">
        <ClerkProvider>
        <div className="relative z-10">
          <AppProviders>{children}</AppProviders>
          {process.env.NODE_ENV === "development" ? <WebVitals /> : null}
        </div>
        </ClerkProvider>
      </body>
    </html>
  );
}
