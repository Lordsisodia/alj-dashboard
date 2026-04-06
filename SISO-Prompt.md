# SISO Overlay Prompt (Universal Entry)

Goal: Give any agent a single, reusable checklist to (1) understand intent, (2) choose lightweight vs. BMAD track, (3) size/scope the work, and (4) emit a handoff plan.

## Steps (run in order)
1) **Clarify intent**: Restate user goal + success criteria. If unclear, ask a single clarifying question.
2) **Scope & risk scan**: Note complexity (S/M/L), unknowns, dependencies, and whether multiple roles are needed.
3) **Pick track (BMAD vs. lightweight)**
   - Use BMAD if ≥2 of: multi-phase work, multi-role/party, high risk/compliance, brownfield with unknowns, needs phase gates/status tracking.
   - Otherwise use lightweight SISO loop (sweep → plan → execute).
4) **If BMAD chosen**
   - Ensure `.bmad/vendor/BMAD-METHOD` present; apply SISO overlay if needed.
   - Pick BMAD track: Quick Flow (small), Method (default), Enterprise (large/regulatory).
   - Select BMAD workflow (Planning/Solutioning/Implementation/Assurance) + agents/party; honor BMAD activation rules (load config: {user_name}, {communication_language}; show numbered menu; wait for input).
   - Initialize/update workflow-status file if using status routing.
   - Use BMAD path vars `{project-root}`, `{bmad_folder}`, `{agent-folder}`, `{output_folder}` in any workflow/action references (no hardcoded paths).
5) **If lightweight chosen**
   - Run Context Sweeper (*sweep) → Planner (*plan) → Executor (*execute).
6) **Plan granularity**: Break work to fit the chosen track; include tests/verification per step; keep triggers/action items menu-friendly.
7) **Log**: Write context/notes to `project-setup-system/.blackbox/{agent}/` (or BMAD expert sidecar) and keep sources.
8) **Handoff**: Emit the handoff template (`prompt-system/templates/handoff-prompt.md`) with tasks, deliverables, constraints, file pointers.

## BMAD-aligned guardrails (apply whenever BMAD track is chosen)
- **Triggers**: Define triggers without `*`; BMAD auto-prefixes `*help/*exit` and adds asterisks.
- **Descriptions**: Every menu item needs a clear description; no duplicates.
- **Path hygiene**: Use `{project-root}`, `{bmad_folder}`, `{agent-folder}`, `{output_folder}` variables—not absolute paths.
- **Communication**: Always respect `{communication_language}`; address user by `{user_name}`.
- **Expert memory**: If persistence is required, load sidecar files (e.g., `{agent-folder}/memories.md`, `instructions.md`) in critical actions and restrict I/O to that sidecar.
- **Artifacts**: Keep raw accumulation in sidecar/.blackbox; promote curated outputs to docs when stable.
- **Status/workflow routing**: For BMAD party/phase work, use workflow-status files and party-mode where appropriate (planning/solutioning/implementation/assurance tracks).
- **Validation**: Apply a checklist before moving phases (tests planned, risks noted, docs updated).
- **Party mode**: If multiple agents/roles are needed, spin up party-mode with the agent manifest; keep turns short and decisions recorded in status file.
- **Manifest hygiene**: Ensure new or temporary agents are listed in agent-manifest; avoid orphan triggers.

## Deliberate thinking boosts (apply to technical/complex tasks)
- Generate at least two solution hypotheses; compare tradeoffs (time/risk/impact) before choosing.
- List assumptions + unknowns; plan to validate them early.
- Identify edge cases, failure modes, and observability hooks (logs/metrics to watch).
- Sketch test strategy up front (happy, edge, regression), note which are automatable now vs. later.
- Do a quick prior-art scan: similar code paths, templates, or patterns in repo before writing new code.
- Sanity-check outputs against success criteria and constraints before handoff.
- If blocked, propose a minimal fallback path; note what’s needed to unblock.

## MCPs and tools (project defaults)
- **Filesystem**: Use repo paths only; prefer `{project-root}` variables.
- **Search**: Prefer ripgrep/rg for repo search; avoid slow full scans.
- **Web**: Use web search when gaps remain after repo/docs sweep.
- **AI assistants**: Default to SISO agents; BMAD party mode only when BMAD criteria fire.
- **Tests**: Run project-native test runners (e.g., npm/pnpm/vitest) when changes touch code paths.

## BMAD quick-reference crib (don’t memorize, skim)
- **Phase gates**: Planning → Solutioning → Implementation → Assurance; don’t skip gates.
- **Tracks**: Quick Flow (small fixes), Method (default), Enterprise (large/regulated).
- **Party**: Add PM/UX/Analyst/Dev/QA as needed; use manifest for roster.
- **Sidecars**: Expert agents load `memories.md` + `instructions.md`; stay inside sidecar.
- **Path vars**: Always `{project-root}`, `{bmad_folder}`, `{agent-folder}`, `{output_folder}`.
- **Auto-injected**: Help/exit, activation rules, menu handlers—don’t redefine.

## Quick heuristics
- **Small/clear/low-risk** → lightweight.
- **Big/unknown/multi-role/brownfield** → BMAD.
- Default to lightweight unless two BMAD criteria fire.

## Outputs required
- Intent + success criteria
- Track choice + rationale
- Ordered steps with tests
- Handoff prompt
