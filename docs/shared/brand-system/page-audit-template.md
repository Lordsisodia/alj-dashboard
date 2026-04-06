# Page Audit Template

Copy-paste this block into `component-catalog.md` (or keep per-page files if the notes grow large). Each audit should take <10 minutes so we can review dozens of screens quickly.

```
## Page: <route or URL>
- Date reviewed:
- Reviewer:
- Screenshot/Figma link:

### Quick checks
- [ ] Palette only uses tokens from `color-system.md`
- [ ] Typography matches approved stacks (Inter / Geist as specified)
- [ ] Components pulled from `components/ui` or documented exceptions
- [ ] Layout respects container padding / 1400px cap
- [ ] Motion matches existing easing / duration

### Highlights
- Keeps:
  - …
- Elements to iterate:
  - …

### Decisions / Tasks
- [ ] Promote component to shared package (`packages/ui` target)
- [ ] Update Tailwind token
- [ ] Create ADR / note in `architecture-alignment.md`
- [ ] Add QA screenshots to reference gallery
```

Feel free to add story links, GA metrics, or qualitative notes below the template if a page requires more context.
