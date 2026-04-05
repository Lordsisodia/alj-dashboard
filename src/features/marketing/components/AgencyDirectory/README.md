# AgencyDirectory

Directory listing page for `/agency-directory` route. Provides hero, sidebar filters, and agency feed (search/filter results).

| File | Purpose |
|------|---------|
| `index.tsx` | Root export; composes Hero, Filters, Feed |
| `DirectoryHero.tsx` | Page header with title and description |
| `DirectoryFilters.tsx` | Sidebar with filter groups (tags, categories) |
| `DirectoryFeed.tsx` | Agency card grid with metadata |
| `types.ts` | TypeScript interfaces for agencies and filters |

## Props & Data

Accepts `{ data: AgencyDirectoryData }` where:
- `hero`: title, description
- `filterGroups`: array of {label, options}
- `agencies`: array with name, description, image, tags, link

## Where it's used

`app/agency-directory/page.tsx`
