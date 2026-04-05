import type { Metadata, Viewport } from "next";
import React from "react";
import WebVitals from "@/components/analytics/WebVitals";
import { AppProviders } from "./providers";
import { PartnershipsWaveBackdrop } from "@/domains/partnerships/_shared/ui/backgrounds/PartnershipsWaveBackdrop";
import "./globals.css";

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
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://api.dicebear.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen bg-black text-white">
        {/* Global animated partnership backdrop */}
        <PartnershipsWaveBackdrop
          position="fixed"
          className="-z-10"
          strokeColor="#ffc27d"
          waveBackgroundColor="transparent"
          waveOpacity={0.55}
          wavesClassName="h-full w-full"
          pointerSize={0.32}
          radialTop="#120b06"
          radialBase="#040404"
          overlayClassName="bg-gradient-to-b from-black/30 via-black/55 to-black/80"
          waveBlurPx={6}
          overlayBlurPx={2}
        />

        <div className="relative z-10">
          <AppProviders>{children}</AppProviders>
          {process.env.NODE_ENV === "development" ? <WebVitals /> : null}
        </div>
      </body>
    </html>
  );
}
