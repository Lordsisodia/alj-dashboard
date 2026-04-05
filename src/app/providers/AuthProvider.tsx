"use client";

import { ReactNode } from "react";

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  // TODO: wire Clerk/Supabase session sync once services are ready
  return <>{children}</>;
}

export default AuthProvider;
