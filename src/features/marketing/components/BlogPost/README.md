# BlogPost

Blog post detail page for `/post/[slug]` route. Renders breadcrumb, hero header, sticky table of contents sidebar, article content, sidebar CTA, related articles, and footer.

| File | Purpose |
|------|---------|
| `index.tsx` | Root export; manages layout and data fetching |
| `BlogPostHero.tsx` | Breadcrumb, title, description, publish date |
| `BlogPostSidebar.tsx` | Sticky TOC generated from article headings |
| `BlogPostContent.tsx` | Rendered HTML body with rich text support |
| `BlogPostSidebarCTA.tsx` | Right sidebar CTA card (newsletter/resources) |
| `BlogPostRelated.tsx` | Carousel of 3 related posts by slug |
| `BlogPostCTA.tsx` | Bottom-of-page call-to-action |
| `data/sample-posts.ts` | Blog post collection with slug->data mapping |

## Props & Data

Accepts `{ post: BlogPostData }` where:
- `slug, title, description, coverImage`
- `bodyHtml`: rendered markdown/HTML article body
- `relatedSlugs`: array of related post slugs for lookup

## Where it's used

`app/post/[slug]/page.tsx`
