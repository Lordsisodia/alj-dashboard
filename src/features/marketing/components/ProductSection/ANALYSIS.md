# Creative Analytics & Production Section - Full Analysis

## Section Overview
**Purpose:** Showcases two product features: "Lens" (analytics) and "Briefs" (workflow), each with tabbed content, video animations, and screenshots.

**Structure:** `.section.overflow-hidden` > `.home-product` > header + 2x `.home-product-grid`

---

## Section CSS (`.section.overflow-hidden`)
```css
background: #000 (implicit from body)
overflow: hidden
```

---

## Container CSS (`.container.section-container`)
```css
max-width: 1216px
padding-left: 24px
padding-right: 24px
```

---

## Main Product Container (`.home-product`)
```css
grid-column-gap: 80px
grid-row-gap: 80px
flex-flow: column
padding-top: 128px
padding-bottom: 40px
display: flex
```

---

## Section Header (`.section-head`)

### Wrapper (`.section-head-wrapper`)
```css
grid-column-gap: 12px
grid-row-gap: 12px
flex-flow: column
align-items: center
display: flex
```

### Label (`.text-overline`)
```css
letter-spacing: .166667em
text-transform: uppercase
font-family: Inter, sans-serif
font-size: .75rem (12px)
font-weight: 550
line-height: 1rem
color: rgba(255,255,255,0.68) (--_lens---neutral-50)
```

### Title (`.text-display-h2`)
```css
letter-spacing: -.0075em
font-family: Inter Display, Arial, sans-serif
font-size: 2.75rem (44px)
font-weight: 600
line-height: 3.36rem (54px)
color: white (--_lens---neutral-0)
```

### Paragraph (`.text-body-l`)
```css
font-size: 1.125rem (18px)
line-height: 1.75rem (28px)
font-family: Inter, sans-serif
color: rgba(255,255,255,0.36) (--_lens---neutral-300)
max-width: 512px
```

---

## Product Grid Layout (`.home-product-grid`)
```css
flex-flow: column
display: flex
gap: 16px
```

---

## Product Content Card (`.home-product-content`)
```css
box-shadow: 0 0 0 1px var(--_lens---neutral-700) /* rgba(255,255,255,0.1) */
border-radius: 24px
flex-flow: column
flex: 3 1 0
padding: 32px
display: flex
position: relative
overflow: hidden
```

### Content Header (`.home-research-sidebar-head`)
- Contains label + title

### Card Label (`.text-overline`)
```css
font-size: .75rem (12px)
font-weight: 550
line-height: 1rem
letter-spacing: .166667em
text-transform: uppercase
color: rgba(255,255,255,0.36) (--_lens---neutral-300)
```

### Card Title (`.text-display-h3`)
```css
letter-spacing: -.00722222em
font-family: Inter Display, Arial, sans-serif
font-size: 2.25rem (36px)
font-weight: 600
line-height: 2.75rem (44px)
color: white (--_lens---neutral-0)
```

---

## Buttons (`.main-cta-buttons`)
```css
display: flex
align-items: center
gap: 16px
flex-wrap: wrap
justify-content: center
```

### Primary Button (`.button-dark.button-secondary`)
```css
background: rgba(255,255,255,0.1) (--_lens---neutral-700)
color: white (--_lens---solid-0)
border-radius: 10px
padding: 8px
font-weight: 600
font-size: 16px
font-family: Inter
```

### Ghost Button (`.button-dark.button-ghost`)
```css
background: #020308 (--_lens---background)
color: white
border-radius: 10px
padding: 8px
font-weight: 600
font-size: 16px
```

### Button Text (`.text-heading-m`)
```css
font-family: Inter, sans-serif
font-size: 1rem (16px)
font-weight: 550
line-height: 1.5rem (24px)
letter-spacing: -.01125em
padding-left: 6px
padding-right: 6px
```

### Button Icon (`.button-icon-block`)
```css
opacity: 0.68
width: 24px
height: 24px
margin-left: -4px (when icon-right)
```

---

## Tab Links (`.home-product-tabs-links`)
```css
flex-flow: column
flex: 1
display: flex
position: relative
z-index: 2
```

### Tab Link (`.home-product-tab-link`)
```css
color: rgba(255,255,255,0.56) (--_lens---neutral-200)
cursor: pointer
background: transparent
border-radius: 10px
padding: 6px 20px 6px 6px
transition: all .4s cubic-bezier(.19,1,.22,1)
display: flex
gap: 6px
```

### Active Tab (`.home-product-tab-link.is-active`)
```css
color: white (--_lens---solid-0)
```

### Tab Label (`.text-label-m`)
```css
font-family: Inter, sans-serif
font-size: 1rem (16px)
font-weight: 500
line-height: 1.5rem (24px)
letter-spacing: -.01125em
```

---

## Animation Container (`.home-product-animation`)
```css
justify-content: flex-end
align-self: center
align-items: flex-end
margin-top: -16px
margin-bottom: -219px
margin-right: -58px
position: absolute
inset: 0% 0% auto auto
```

### Video (`.padding-video`)
```css
transform: translateY(-15%) scale(2)
```

### Isometric Image (`.product-isometric-image`)
```css
width: 175px
height: 175px
max-width: none
display: block
```

---

## Product Figure (`.home-product-figure`)
```css
background-color: rgba(255,255,255,0.05) (--_lens---neutral-800)
border-radius: 24px
flex: 7 1 0
height: 640px
display: flex
position: relative
overflow: hidden
```

### Tab Background (`.home-product-tab-bg`)
```css
pointer-events: none
width: 100%
height: 100%
display: flex
position: absolute
inset: 0%
```

### Tab Panes (`.home-product-tab-panes`)
```css
width: 100%
height: 100%
position: relative
```

### Tab Pane (`.home-product-tab-pane`)
```css
aspect-ratio: 16/14
color: white (--_lens---solid-0)
justify-content: center
align-items: center
width: 100%
height: 100%
display: none /* hidden by default */
```

### Active Pane (`.home-product-tab-pane.is-active`)
```css
display: flex
```

### Tab Image (`.home-product-tab-image`)
```css
object-fit: cover
width: 100%
height: 100%
```

---

## Two Products in Section

### Product 1: Lens
**Label:** "Lens"
**Title:** "Know what's working and why"

**Tabs:**
1. Creative Test Analysis (icon: brain/head)
2. Build & Share Reports (icon: chart)
3. Compare Winning Themes (icon: compare)

**Video:** `/assets/cdn.foreplay.co/cta-lens.mp4`

**Screenshot Images:**
- `creative-test-analysis.webp`
- `build-and-share-reports.webp`
- `compare-segments.webp`

**Background:** `lens-product-bg.webp`

---

### Product 2: Briefs
**Label:** "Briefs"
**Title:** "Go from concept to launched, faster"

**Tabs:**
1. Storyboard & Script (icon: edit/script)
2. Brand Profiles (icon: building)
3. Modular Brief Builder (icon: grid)

**Video:** `/assets/cdn.foreplay.co/cta-briefs.mp4`

**Screenshot Images:**
- `briefs-storyboard-2.webp`
- `brand-profiles.webp`
- `brief-editor.webp`

**Background:** `home-briefs-bg.webp`

---

## Screenshot Image URLs

### Lens Product
- BG: https://cdn.prod.website-files.com/62a4ed18ddad95dde8b8bfa4/6818f491db7df5646bba2c71_lens-product-bg.webp
- Tab 1: https://cdn.prod.website-files.com/62a4ed18ddad95dde8b8bfa4/6818f4ab1be4acb01b76b457_creative-test-analysis.webp
- Tab 2: https://cdn.prod.website-files.com/62a4ed18ddad95dde8b8bfa4/6818f4abf647a12cb791df19_build-and-share-reports.webp
- Tab 3: https://cdn.prod.website-files.com/62a4ed18ddad95dde8b8bfa4/6818f4abb4e886135485759a_compare-segments.webp
- Isometric: https://cdn.prod.website-files.com/62a4ed18ddad95dde8b8bfa4/682f93b43a94db00dbc45367_iso-lens.webp

### Briefs Product
- BG: https://cdn.prod.website-files.com/62a4ed18ddad95dde8b8bfa4/680bbc29f6ff9917b3df880f_home-briefs-bg.webp
- Tab 1: https://cdn.prod.website-files.com/62a4ed18ddad95dde8b8bfa4/68191db8d6fd3e791a16b485_briefs-storyboard-2.webp
- Tab 2: https://cdn.prod.website-files.com/62a4ed18ddad95dde8b8bfa4/6818f77a3cb4900456b65643_brand-profiles.webp
- Tab 3: https://cdn.prod.website-files.com/62a4ed18ddad95dde8b8bfa4/681b51296ef70672be45e334_brief-editor.webp
- Isometric: https://cdn.prod.website-files.com/62a4ed18ddad95dde8b8bfa4/682f93b44b8360f413644eb7_iso-briefs.webp

---

## Key React Implementation Notes

1. **Tabs require state** - click tab → show corresponding image
2. **Videos autoplay** - need `<video autoPlay playsInline muted loop>`
3. **Two products stacked** - Lens on top, Briefs below
4. **Product cards are side-by-side** with figure on right in each grid
5. **Absolute positioning** for animation overlay on the figure
6. **Gap between products**: 80px (from grid-row-gap on .home-product)

## Colors Reference
```css
--_lens---neutral-0: white (#fff)
--_lens---neutral-50: rgba(255,255,255,0.84)
--_lens---neutral-200: rgba(255,255,255,0.56)
--_lens---neutral-300: rgba(255,255,255,0.36)
--_lens---neutral-700: rgba(255,255,255,0.1)
--_lens---neutral-800: rgba(255,255,255,0.05)
--_lens---background: #020308
--_lens---solid-0: white (#fff)
--_lens---solid-900: #090a0e
```
