# components/layout/

App shell components — always on screen regardless of which page the user is on.

## Contents

| Folder | Purpose |
|--------|---------|
| `navbar/` | Sticky top nav with Product, Solutions, Resources dropdowns |

## How it's wired

`components/Layout.tsx` is the single entry point:
- Checks `usePathname()` — skips navbar/chatbot for auth routes (`/sign-up`, `/sign-in`)
- Renders: `<NavBar />` → `<main>{children}</main>` → `<ChatBotIcon />`

`app/layout.tsx` wraps the entire app with `<Layout>`.

## Adding to the shell

To add a new persistent element (e.g. a cookie banner, announcement bar):
1. Create `layout/announcement/index.tsx`
2. Import and render in `components/Layout.tsx`
3. Add to `AUTH_ROUTES` exclusion list if it shouldn't show on auth pages
