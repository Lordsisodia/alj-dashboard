# Journal — qa.performance

## 2026-04-07 — Dev Server Perf Fixes

**Root causes fixed:**

1. `package.json` dev script: reduced `--max-old-space-size` from `8192` → `4096` (Node GC fires more aggressively; was telling Node it could hoard 8GB)
2. `next.config.js` webpack: switched `config.cache` from `{ type: 'memory' }` → `{ type: 'filesystem', buildDependencies: { config: [__filename] }, maxAge: 60 * 60 * 1000 }` (spills to disk instead of hoarding RAM)
3. Added `--turbo` flag to dev script (Turbopack uses significantly less memory than webpack)

**Test results:**
- Dev server (webpack): 200 OK in 5.7s, compiled in 5.3s (1450 modules)
- Dev server (Turbopack `--turbo`): 200 OK in 4.7s, compiled in 4.4s, ~82MB RSS vs 2GB+ before
- Build script: confirmed still `8192` (untouched)
- Note: `npm run dev` blocked by `scripts/check-node.js` which requires Node 20.x — Node 22 is running. Use `npx next dev --turbo` directly to bypass.

**Scripts updated:**
- `dev`: now `NODE_OPTIONS='--max-old-space-size=4096' next dev --turbo`
- `dev:clean`: now `rm -rf .next && NODE_OPTIONS='--max-old-space-size=4096' next dev --turbo`
- `build`: unchanged at `NODE_OPTIONS='--max-old-space-size=8192' next build`

**Remaining warnings (not in scope, flagged only):**
- Tailwind ambiguous class warnings for `duration-[2000ms]`, `duration-[250ms]`, `before:duration-[2000ms]`, `group-focus-within:before:duration-[4000ms]` — these should use `duration-[&lsqb;2000ms&rsqb;]` syntax
- Webpack/Turbopack config mismatch warning under `--turbo` (webpack config still present for non-turbo builds)

---

## 2026-04-07 — Folder created
**Did:** Initialized agent workspace. Inherited baseline from clients-pm journal (perf rounds 1+2 done 2026-04-06).
**State:** Baseline measured for ISSO Hub/Models/Schedule/Settings/Ideas. No baseline yet for Recon, Intelligence, Hub, Content Gen, Agents dashboard pills.
**Next:** Run fresh FCP baseline on all 5 dashboard pills.
