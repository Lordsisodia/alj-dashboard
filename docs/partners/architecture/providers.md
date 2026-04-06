# Partnerships Runtime Providers

| Provider | Location | Purpose | Notes |
|----------|----------|---------|-------|
| `QueryProvider` | `src/app/providers/QueryProvider.tsx` | Boots TanStack Query (5.62.11) for consistent caching across all partner features. | Wraps the entire app via `AppProviders` in `src/app/layout.tsx`. |
| `RealtimeProvider` | `src/app/providers/RealtimeProvider.tsx` | Placeholder for Supabase/websocket realtime context. | Currently a pass-through; replace with actual realtime logic as services are wired. |
| `AuthProvider` | `src/app/providers/AuthProvider.tsx` | Placeholder for Clerk ↔ Supabase session sync. | Currently a pass-through; update once auth integration is live. |
| `AppProviders` | `src/app/providers/index.tsx` | Composes Auth → Realtime → Query providers. | Imported in `src/app/layout.tsx`. |

## Usage

```tsx
// src/app/layout.tsx
import { AppProviders } from "./providers";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AppProviders>{children}</AppProviders>
        {/* ... */}
      </body>
    </html>
  );
}
```

Feature code should *only* use hooks from these providers (e.g., `useQuery`, future `useRealtime`, `useAuth`) via their respective application-layer wrappers.
