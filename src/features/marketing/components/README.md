# react-rebuild/

Active component library — all modern React components built from the ground up.

## Top-level components

| Folder | Route(s) | Type |
|--------|----------|------|
| `ProductPage/` | `/hub` `/intelligence` `/recon` `/agents` `/content-gen` | Template |
| `IndustryPage/` | `/ecommerce` `/b2b-saas` `/agencies` etc | Template |
| `HeroSection/` | `/` (homepage) | Section |
| `ProductSection/` | `/` (homepage) | Section |
| `SecretWeaponSection/` | `/` (homepage) | Section |
| `CollaborationSection/` | `/` (homepage) | Section |
| `FeaturesSection/` | `/` (homepage) | Section |
| `Footer/` | All pages via `app/` imports | Layout |
| `Blog/` | `/blog` | Page |
| `BlogPost/` | `/post/[slug]` | Page |
| `BookDemo/` | `/book-demo` | Page |

## Templates vs Sections

- **Templates** (`ProductPage/`, `IndustryPage/`): full page wrappers, driven by `data/` files. Add new pages by adding a data file — no template changes needed.
- **Sections**: single-purpose blocks assembled by `app/page.tsx`.

## Naming convention

PascalCase folder = one exported component. Index file is always `index.tsx`.
Data files live in `ComponentName/data/`. UI subcomponents in `ComponentName/ui/`.
