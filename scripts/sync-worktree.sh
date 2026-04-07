#!/usr/bin/env bash
# sync-worktree.sh — Sync shared files from main repo into a worktree
#
# Run this at the START of every agent session, and any time main adds new
# shared components (src/components/ui/, etc.)
#
# Usage (from main repo):
#   bash scripts/sync-worktree.sh <branch-suffix>
#
# Usage (from inside the worktree):
#   bash /Users/shaansisodia/SISO_Workspace/SISO_Agency/apps/isso-dashboard/scripts/sync-worktree.sh <branch-suffix>

set -e

MAIN_DIR="/Users/shaansisodia/SISO_Workspace/SISO_Agency/apps/isso-dashboard"
BRANCH_SUFFIX="${1:-}"

if [ -z "$BRANCH_SUFFIX" ]; then
  echo "Usage: bash scripts/sync-worktree.sh <branch-suffix>"
  exit 1
fi

WORKTREE_DIR="/Users/shaansisodia/SISO_Workspace/SISO_Agency/apps/isso-dashboard-${BRANCH_SUFFIX}"

if [ ! -d "$WORKTREE_DIR" ]; then
  echo "Worktree not found at $WORKTREE_DIR"
  exit 1
fi

echo "Syncing shared files into worktree: $BRANCH_SUFFIX"

# ── 1. Ensure .env.local symlink is intact ────────────────────────────────────

if [ ! -f "$WORKTREE_DIR/.env.local" ] && [ ! -L "$WORKTREE_DIR/.env.local" ]; then
  ln -s "$MAIN_DIR/.env.local" "$WORKTREE_DIR/.env.local"
  echo ".env.local symlink restored"
else
  echo ".env.local ok"
fi

# ── 2. Sync src/components/ui/ ────────────────────────────────────────────────

mkdir -p "$WORKTREE_DIR/src/components/ui"
rsync -a --update "$MAIN_DIR/src/components/ui/" "$WORKTREE_DIR/src/components/ui/"
echo "src/components/ui/ synced"

# ── 3. Ensure ALLOW_NODE_ANY is set ──────────────────────────────────────────

if [ ! -f "$WORKTREE_DIR/.env.worktree" ]; then
  echo "ALLOW_NODE_ANY=1" > "$WORKTREE_DIR/.env.worktree"
  echo ".env.worktree written"
fi

echo ""
echo "Sync complete. Worktree is up to date with main shared files."
