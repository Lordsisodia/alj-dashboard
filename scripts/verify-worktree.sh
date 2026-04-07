#!/usr/bin/env bash
# verify-worktree.sh — Pre-commit verification for agent worktrees
#
# Agents MUST run this before committing. If any check fails, fix it first.
#
# Usage:
#   bash scripts/verify-worktree.sh <branch-suffix> <port>
#
# Example:
#   bash scripts/verify-worktree.sh qualify-fixes 3002

set -e

MAIN_DIR="/Users/shaansisodia/SISO_Workspace/SISO_Agency/apps/isso-dashboard"
BRANCH_SUFFIX="${1:-}"
PORT="${2:-}"

if [ -z "$BRANCH_SUFFIX" ]; then
  echo "Usage: bash scripts/verify-worktree.sh <branch-suffix> <port>"
  exit 1
fi

WORKTREE_DIR="/Users/shaansisodia/SISO_Workspace/SISO_Agency/apps/isso-dashboard-${BRANCH_SUFFIX}"
PASS=0
FAIL=0

echo ""
echo "Pre-commit verification: $BRANCH_SUFFIX"
echo "────────────────────────────────────────"

# ── Check 1: TypeScript ───────────────────────────────────────────────────────

echo ""
echo "Check 1/5 — TypeScript compilation..."
cd "$WORKTREE_DIR"

# Get list of files changed vs base branch
CHANGED_FILES=$(git diff --name-only origin/dev/isso-dashboard-v2...HEAD 2>/dev/null || git diff --name-only HEAD~1 2>/dev/null || echo "")

TS_ERRORS=$(ALLOW_NODE_ANY=1 ./node_modules/.bin/tsc --noEmit 2>&1 | grep "^src/" | grep -v "marketing/\|api/drive/\|api/recon/\|api/tools/" || true)

if [ -z "$TS_ERRORS" ]; then
  echo "  PASS — no TypeScript errors in src/"
  PASS=$((PASS + 1))
else
  echo "  FAIL — TypeScript errors found:"
  echo "$TS_ERRORS" | head -20
  FAIL=$((FAIL + 1))
fi

# ── Check 2: New components are imported somewhere ────────────────────────────

echo ""
echo "Check 2/5 — Wiring check (new components are imported)..."

NEW_COMPONENTS=$(git diff --name-only origin/dev/isso-dashboard-v2...HEAD 2>/dev/null | grep "src/.*components/.*\.tsx$" | grep -v "__tests__" || true)
WIRING_FAIL=0

if [ -z "$NEW_COMPONENTS" ]; then
  echo "  PASS — no new component files detected"
  PASS=$((PASS + 1))
else
  for COMPONENT_FILE in $NEW_COMPONENTS; do
    COMPONENT_NAME=$(basename "$COMPONENT_FILE" .tsx)
    # Check if it's imported anywhere other than itself
    IMPORT_COUNT=$(grep -r "from.*$COMPONENT_NAME\|import.*$COMPONENT_NAME" "$WORKTREE_DIR/src" --include="*.tsx" --include="*.ts" -l 2>/dev/null | grep -v "$COMPONENT_FILE" | wc -l | tr -d ' ')
    if [ "$IMPORT_COUNT" -eq 0 ]; then
      echo "  FAIL — $COMPONENT_NAME is never imported anywhere (dead code)"
      WIRING_FAIL=1
    else
      echo "  ok   — $COMPONENT_NAME imported in $IMPORT_COUNT file(s)"
    fi
  done
  if [ $WIRING_FAIL -eq 0 ]; then
    echo "  PASS — all new components are wired in"
    PASS=$((PASS + 1))
  else
    FAIL=$((FAIL + 1))
  fi
fi

# ── Check 3: Dev server has no build errors ───────────────────────────────────

echo ""
echo "Check 3/5 — Dev server build errors..."

if [ -n "$PORT" ]; then
  LOGFILE="/tmp/worktree-${BRANCH_SUFFIX}-server.log"
  if [ -f "$LOGFILE" ]; then
    if grep -qi "build error\|module not found\|failed to compile" "$LOGFILE" 2>/dev/null; then
      echo "  FAIL — build errors in server log:"
      grep -i "build error\|module not found\|failed to compile" "$LOGFILE" | head -5
      FAIL=$((FAIL + 1))
    else
      echo "  PASS — no build errors in server log"
      PASS=$((PASS + 1))
    fi
  else
    echo "  SKIP — no server log found at $LOGFILE (start server first with create-agent-worktree.sh)"
    PASS=$((PASS + 1))
  fi
else
  echo "  SKIP — no port provided, skipping server check"
  PASS=$((PASS + 1))
fi

# ── Check 4: Convex pushed if convex/ files changed ──────────────────────────

echo ""
echo "Check 4/5 — Convex schema push..."

CONVEX_CHANGED=$(git diff --name-only origin/dev/isso-dashboard-v2...HEAD 2>/dev/null | grep "^convex/" | grep -v "_generated/" || true)

if [ -z "$CONVEX_CHANGED" ]; then
  echo "  PASS — no convex/ changes (no push needed)"
  PASS=$((PASS + 1))
else
  # Check if _generated files are also updated
  GENERATED_CHANGED=$(git diff --name-only origin/dev/isso-dashboard-v2...HEAD 2>/dev/null | grep "convex/_generated/" || true)
  if [ -z "$GENERATED_CHANGED" ]; then
    echo "  FAIL — convex/ files changed but convex/_generated/ not updated"
    echo "  Run: export PATH=\"/opt/homebrew/bin:/usr/local/bin:\$PATH\" && npx convex dev --once"
    FAIL=$((FAIL + 1))
  else
    echo "  PASS — convex/_generated/ is up to date"
    PASS=$((PASS + 1))
  fi
fi

# ── Check 5: No orphaned props (basic grep) ───────────────────────────────────

echo ""
echo "Check 5/5 — Orphaned props check..."

# Look for props defined in interface but potentially not destructured
# Simple heuristic: look for lines that define a prop in an interface but grep if it's used in JSX
ORPHAN_FAIL=0
CHANGED_TSX=$(git diff --name-only origin/dev/isso-dashboard-v2...HEAD 2>/dev/null | grep "\.tsx$" || true)

for FILE in $CHANGED_TSX; do
  FULL_PATH="$WORKTREE_DIR/$FILE"
  if [ -f "$FULL_PATH" ]; then
    # Find props defined in interface that might not be used
    # Look for lines like "  propName: type;" in interfaces
    INTERFACE_PROPS=$(grep -E "^\s+[a-zA-Z]+(\?)?:\s+\S" "$FULL_PATH" 2>/dev/null | grep -v "//" | grep -v "className\|style\|children" | sed "s/[[:space:]]//g" | sed "s/:.*//g" | sed "s/?//g" || true)
    for PROP in $INTERFACE_PROPS; do
      USE_COUNT=$(grep -c "\b${PROP}\b" "$FULL_PATH" 2>/dev/null || echo "0")
      # Prop appears in interface (1 time) + should appear at least in destructure (2+)
      if [ "$USE_COUNT" -lt 2 ]; then
        echo "  warn — $PROP in $(basename $FILE) appears only once (possibly unused)"
        ORPHAN_FAIL=1
      fi
    done
  fi
done

if [ $ORPHAN_FAIL -eq 0 ]; then
  echo "  PASS — no obvious orphaned props"
  PASS=$((PASS + 1))
else
  echo "  (warnings above are non-blocking — review manually)"
  PASS=$((PASS + 1))
fi

# ── Summary ───────────────────────────────────────────────────────────────────

echo ""
echo "────────────────────────────────────────"
echo "Results: $PASS passed, $FAIL failed"
echo ""

if [ $FAIL -gt 0 ]; then
  echo "VERIFICATION FAILED — fix the issues above before committing"
  exit 1
else
  echo "VERIFICATION PASSED — safe to commit"
  exit 0
fi
