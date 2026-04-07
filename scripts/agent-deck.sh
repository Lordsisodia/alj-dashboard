#!/usr/bin/env bash
# agent-deck.sh — Spin up all ISSO agents in tmux panes
# Usage: bash scripts/agent-deck.sh
# Each pane runs claude in the right directory, ready for prompts.

export PATH="/opt/homebrew/bin:/usr/local/bin:$PATH"

DIR="/Users/shaansisodia/SISO_Workspace/SISO_Agency/apps/isso-dashboard"
SESSION="agent-deck"

tmux kill-session -t "$SESSION" 2>/dev/null || true
tmux new-session -d -s "$SESSION" -x 250 -y 60

# ── Helper: boot message sent to each pane ────────────────────────────────────
boot() {
  local pane="$1"
  local agent_folder="$2"
  local label="$3"
  tmux send-keys -t "$SESSION:$pane" \
    "cd $DIR && clear && echo '[$label] Ready — type: claude' && echo 'Context: .agents/$agent_folder/'" \
    Enter
}

# ═══════════════════════════════════════════════════════════════════════════════
# WINDOW 1 — INTELL (4 panes: dashboard / qualify / analysis / insights)
# ═══════════════════════════════════════════════════════════════════════════════
tmux rename-window -t "$SESSION:1" "intell"
tmux split-window -h -t "$SESSION:intell"
tmux split-window -v -t "$SESSION:intell.1"
tmux split-window -v -t "$SESSION:intell.2"
tmux select-layout -t "$SESSION:intell" tiled

boot "intell.1" "ui-intelligence" "INTELL:dashboard"
boot "intell.2" "ui-intelligence" "INTELL:qualify"
boot "intell.3" "ui-intelligence" "INTELL:analysis"
boot "intell.4" "ui-intelligence" "INTELL:insights"

# ═══════════════════════════════════════════════════════════════════════════════
# WINDOW 2 — RECON (4 panes: dashboard / discovery / creators / feed)
# ═══════════════════════════════════════════════════════════════════════════════
tmux new-window -t "$SESSION" -n "recon"
tmux split-window -h -t "$SESSION:recon"
tmux split-window -v -t "$SESSION:recon.1"
tmux split-window -v -t "$SESSION:recon.2"
tmux select-layout -t "$SESSION:recon" tiled

boot "recon.1" "ui-recon" "RECON:dashboard"
boot "recon.2" "ui-recon" "RECON:discovery"
boot "recon.3" "ui-recon" "RECON:creators"
boot "recon.4" "ui-recon" "RECON:feed"

# ═══════════════════════════════════════════════════════════════════════════════
# WINDOW 3 — HUB (4 panes: dashboard / vault / approve / saved)
# ═══════════════════════════════════════════════════════════════════════════════
tmux new-window -t "$SESSION" -n "hub"
tmux split-window -h -t "$SESSION:hub"
tmux split-window -v -t "$SESSION:hub.1"
tmux split-window -v -t "$SESSION:hub.2"
tmux select-layout -t "$SESSION:hub" tiled

boot "hub.1" "ui-hub" "HUB:dashboard"
boot "hub.2" "ui-hub" "HUB:vault"
boot "hub.3" "ui-hub" "HUB:approve"
boot "hub.4" "ui-hub" "HUB:saved"

# ═══════════════════════════════════════════════════════════════════════════════
# WINDOW 4 — CONTENT GEN (4 panes: dashboard / scenes / generate / gallery)
# ═══════════════════════════════════════════════════════════════════════════════
tmux new-window -t "$SESSION" -n "content-gen"
tmux split-window -h -t "$SESSION:content-gen"
tmux split-window -v -t "$SESSION:content-gen.1"
tmux split-window -v -t "$SESSION:content-gen.2"
tmux select-layout -t "$SESSION:content-gen" tiled

boot "content-gen.1" "ui-content-gen" "CGEN:dashboard"
boot "content-gen.2" "ui-content-gen" "CGEN:scenes"
boot "content-gen.3" "ui-content-gen" "CGEN:generate"
boot "content-gen.4" "ui-content-gen" "CGEN:gallery"

# ═══════════════════════════════════════════════════════════════════════════════
# WINDOW 5 — AGENTS (1 pane — simpler section)
# ═══════════════════════════════════════════════════════════════════════════════
tmux new-window -t "$SESSION" -n "agents-win"
boot "agents-win.1" "ui-agents" "AGENTS"

# ═══════════════════════════════════════════════════════════════════════════════
# WINDOW 6 — QA (3 panes: perf / architecture / refactor)
# ═══════════════════════════════════════════════════════════════════════════════
tmux new-window -t "$SESSION" -n "qa"
tmux split-window -h -t "$SESSION:qa"
tmux split-window -v -t "$SESSION:qa.2"
tmux select-layout -t "$SESSION:qa" even-horizontal

boot "qa.1" "qa-performance"  "QA:perf"
boot "qa.2" "qa-architecture" "QA:arch"
boot "qa.3" "qa-refactor"     "QA:refactor"

# ═══════════════════════════════════════════════════════════════════════════════
# WINDOW 7 — FEAT AI (1 pane)
# ═══════════════════════════════════════════════════════════════════════════════
tmux new-window -t "$SESSION" -n "feat-ai"
boot "feat-ai.1" "feat-ai" "FEAT:ai"

# ── Print map ─────────────────────────────────────────────────────────────────
echo ""
echo "✅  agent-deck running"
echo ""
echo "  Ctrl+b 1  → INTELL     (dashboard | qualify | analysis | insights)"
echo "  Ctrl+b 2  → RECON      (dashboard | discovery | creators | feed)"
echo "  Ctrl+b 3  → HUB        (dashboard | vault | approve | saved)"
echo "  Ctrl+b 4  → CONTENT GEN(dashboard | scenes | generate | gallery)"
echo "  Ctrl+b 5  → AGENTS     (single pane)"
echo "  Ctrl+b 6  → QA         (perf | architecture | refactor)"
echo "  Ctrl+b 7  → FEAT AI    (single pane)"
echo ""
echo "  In each pane: type 'claude' to start the agent"
echo "  Or: I send prompts directly via tmux send-keys"
echo ""
echo "Attach: tmux attach -t agent-deck"
