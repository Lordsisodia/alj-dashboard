#!/usr/bin/env bash
# studio.sh — Run dev (:3001) + prod preview (:3000) from same codebase
# Usage: bash scripts/studio.sh

export PATH="/opt/homebrew/bin:/usr/local/bin:$PATH"

DIR="/Users/shaansisodia/SISO_Workspace/SISO_Agency/apps/isso-dashboard"
SESSION="isso-studio"

tmux kill-session -t "$SESSION" 2>/dev/null || true
tmux new-session -d -s "$SESSION" -x 220 -y 50

# Window 1 — Dev server :3001 (agents build here, errors visible)
tmux rename-window -t "$SESSION:1" "dev-3001"
tmux send-keys -t "$SESSION:1" "cd $DIR && PORT=3001 npm run dev" Enter

# Window 2 — Prod preview :3000 (your review port — rebuild when ready)
tmux new-window -t "$SESSION" -n "prod-3000"
tmux send-keys -t "$SESSION:2" "cd $DIR && npm run build && npm run start" Enter

# Window 3 — Convex watcher
tmux new-window -t "$SESSION" -n "convex"
tmux send-keys -t "$SESSION:3" "cd $DIR && npx convex dev" Enter

# Window 4 — Free shell
tmux new-window -t "$SESSION" -n "shell"
tmux send-keys -t "$SESSION:4" "cd $DIR" Enter

echo "✅ isso-studio running"
echo "   🔧 Dev  → http://localhost:3001  (agents build here)"
echo "   🏭 Prod → http://localhost:3000  (your review port)"
echo ""
echo "Attach: tmux attach -t isso-studio"
echo "  Ctrl+b 1 → dev | Ctrl+b 2 → prod | Ctrl+b 3 → convex | Ctrl+b 4 → shell"
echo "  Ctrl+b d → detach"
