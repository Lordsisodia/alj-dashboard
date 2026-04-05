"use client";

import { ReactNode } from "react";
import { QueryProvider } from "./QueryProvider";
import { RealtimeProvider } from "./RealtimeProvider";
import { AuthProvider } from "./AuthProvider";
import { IssoConvexProvider } from "./ConvexProvider";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <IssoConvexProvider>
      <AuthProvider>
        <RealtimeProvider>
          <QueryProvider>{children}</QueryProvider>
        </RealtimeProvider>
      </AuthProvider>
    </IssoConvexProvider>
  );
}

export default AppProviders;
