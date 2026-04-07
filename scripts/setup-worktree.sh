#!/usr/bin/env bash
# setup-worktree.sh — One-time setup for dev/prod split
# Usage: bash scripts/setup-worktree.sh
# Run this ONCE before using studio.sh

set -e

MAIN_DIR="/Users/shaansisodia/SISO_Workspace/SISO_Agency/apps/isso-dashboard"
DEV_DIR="/Users/shaansisodia/SISO_Workspace/SISO_Agency/apps/isso-dashboard-dev"
DEV_BRANCH="dev/isso-dashboard-v2"

echo "🔧  Setting up ISSO dev/prod split..."
echo ""

cd "$MAIN_DIR"

# ── 1. Confirm dev branch exists ─────────────────────────────────────────────

if git show-ref --verify --quiet "refs/heads/$DEV_BRANCH"; then
  echo "✅  Dev branch '$DEV_BRANCH' exists"
else
  echo "❌  Dev branch '$DEV_BRANCH' not found. Check git branch -a"
  exit 1
fi

# ── 2. Create git worktree ────────────────────────────────────────────────────

if [ -d "$DEV_DIR" ]; then
  echo "✅  Dev worktree already exists at $DEV_DIR"
else
  echo "📁  Creating dev worktree at $DEV_DIR..."
  git worktree add "$DEV_DIR" "$DEV_BRANCH"
  echo "✅  Worktree created"
fi

# ── 3. Install deps in worktree ───────────────────────────────────────────────

echo ""
echo "📦  Installing dependencies in dev worktree..."
cd "$DEV_DIR"
npm install --legacy-peer-deps 2>/dev/null || npm install

# ── 4. Copy .env.local if needed ─────────────────────────────────────────────

if [ ! -f "$DEV_DIR/.env.local" ]; then
  if [ -f "$MAIN_DIR/.env.local" ]; then
    echo "📋  Copying .env.local to dev worktree..."
    cp "$MAIN_DIR/.env.local" "$DEV_DIR/.env.local"
    echo ""
    echo "⚠️   ACTION NEEDED: Open $DEV_DIR/.env.local"
    echo "    Update NEXT_PUBLIC_CONVEX_URL to your DEV Convex deployment URL"
    echo "    (run 'npx convex deploy' in the dev worktree to create one)"
  else
    echo "⚠️   No .env.local found — you'll need to create $DEV_DIR/.env.local manually"
    echo "    Copy from .env.example and fill in your DEV Convex deployment URL"
  fi
else
  echo "✅  .env.local already exists in dev worktree"
fi

# ── 5. Push Convex dev schema ─────────────────────────────────────────────────

echo ""
read -p "🗄️   Push Convex schema to dev deployment now? (y/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
  cd "$DEV_DIR"
  npx convex dev --once
  echo "✅  Convex schema pushed"
fi

# ── Done ──────────────────────────────────────────────────────────────────────

echo ""
echo "✅  Setup complete!"
echo ""
echo "Next steps:"
echo "  1. Update $DEV_DIR/.env.local with your DEV Convex URL (if not done)"
echo "  2. Run: bash scripts/studio.sh"
echo "     → Prod on http://localhost:3000 (main branch)"
echo "     → Dev  on http://localhost:3001 (dev branch)"
echo ""
echo "Agent rules:"
echo "  • Agents commit to 'dev' branch only"
echo "  • Agents never restart servers — write files only"
echo "  • Shaan merges dev → main when approving a batch"
