"use client";

import { ReactNode } from "react";

interface RealtimeProviderProps {
  children: ReactNode;
}

export function RealtimeProvider({ children }: RealtimeProviderProps) {
  // TODO: hook up Supabase realtime or whatever runtime we standardize on
  return <>{children}</>;
}

export default RealtimeProvider;
