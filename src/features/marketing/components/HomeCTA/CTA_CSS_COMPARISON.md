# HomeCTA CSS Comparison: HTML vs React

## Section Container (.home-cta)
| Property | HTML CSS | Our React | Status |
|----------|----------|-----------|--------|
| padding-top | 80px | 200px | DIFF |
| align-items | stretch | stretch | OK |
| gap | 36px | 36px | OK |
| display | flex | flex | OK |
| flex-flow | column | column | OK |

## Headline Wrapper (.section-head.is-large)
| Property | HTML CSS | Our React | Status |
|----------|----------|-----------|--------|
| max-width | 960px | 800px | DIFF |
| z-index | 2 | (not set) | DIFF |
| position | relative | (not set) | DIFF |

## Title (.text-display-h2)
| Property | HTML CSS | Our React | Status |
|----------|----------|-----------|--------|
| font-size | 44px (2.75rem) | 44px | OK |
| font-weight | 600 | 600 | OK |
| line-height | 54px (3.36rem) | 54px | OK |
| letter-spacing | -0.0075em | (not set) | DIFF |
| font-family | Inter Display, Arial, sans-serif | (not set - defaults to system) | DIFF |
| color | white (--_lens---neutral-0 = #fff) | #ffffff | OK |
| text-wrap | balance | (not set) | DIFF |

## Subtext (.text-body-l inside .section-head_paragraph.is-large)
| Property | HTML CSS | Our React | Status |
|----------|----------|-----------|--------|
| font-size | 18px (1.125rem) | 18px | OK |
| line-height | 28px (1.75rem) | 32px | DIFF |
| font-family | Inter, sans-serif | (not set) | DIFF |
| color | --_lens---neutral-300 = rgba(255,255,255,0.36) | rgba(255,255,255,0.75) | DIFF |
| max-width | 640px | 672px | DIFF |

## Buttons (.main-cta-buttons)
| Property | HTML CSS | Our React | Status |
|----------|----------|-----------|--------|
| display | flex | flex | OK |
| gap | 16px | 16px | OK |
| flex-wrap | wrap | wrap | OK |
| justify-content | center | center | OK |

## Primary Button (.button-dark.button-primary)
| Property | HTML CSS | Our React | Status |
|----------|----------|-----------|--------|
| background | white (--_lens---neutral-0) | #ffffff | OK |
| color | --_lens---solid-900 (#090a0e) | #090a0e | OK |
| border-radius | 10px | 10px | OK |
| padding | 8px | 8px 16px | DIFF (width padding) |
| font-weight | 600 | 600 | OK |
| font-size | 16px | 16px | OK |
| font-family | Inter | (not set) | DIFF |
| text-decoration | none | none | OK |
| flex | 1 | (not set) | DIFF |

## Button Text (.text-heading-m)
| Property | HTML CSS | Our React | Status |
|----------|----------|-----------|--------|
| font-size | 16px (1rem) | 16px | OK |
| font-weight | 550 | 600 | DIFF |
| line-height | 24px (1.5rem) | (not set) | DIFF |
| font-family | Inter, sans-serif | (not set) | DIFF |
| letter-spacing | -0.01125em | (not set) | DIFF |

## Button Icon
| Property | HTML CSS | Our React | Status |
|----------|----------|-----------|--------|
| opacity | 0.68 | (not set - defaults to 1) | DIFF |
| width/height | 24px | 16px | DIFF |
| margin-left | -4px (when icon-right) | (not set) | DIFF |

## Secondary Button (.button-dark.button-secondary)
| Property | HTML CSS | Our React | Status |
|----------|----------|-----------|--------|
| background | --_lens---neutral-700 = rgba(255,255,255,0.1) | rgba(255,255,255,0.1) | OK |
| color | --_lens---solid-0 = white | #ffffff | OK |
| border-radius | 10px | 10px | OK |
| padding | 8px | 8px 16px | DIFF |
| font-weight | 600 | 600 | OK |
| font-size | 16px | 16px | OK |
| flex | (not set) | (not set) | N/A |

## Image Wrapper (.home-cta-image-wrapper)
| Property | HTML CSS | Our React | Status |
|----------|----------|-----------|--------|
| margin | 0% -64px -20% | 0 -64px -10% | DIFF (-20% vs -10%) |
| width | 100% (from img) | 100% | OK |
| max-width | none (on img) | none | OK |

## Image (.home-cta-image)
| Property | HTML CSS | Our React | Status |
|----------|----------|-----------|--------|
| width | 100% | 100% | OK |
| height | auto | auto | OK |
| max-width | none | none | OK |
| display | block | block | OK |

## Section Background
| Property | HTML CSS | Our React | Status |
|----------|----------|-----------|--------|
| background | black | #000 | OK |
| overflow | hidden | hidden | OK |
| (no gradient overlay in HTML) | - | (we have gradient div, HTML doesn't) | OK |
