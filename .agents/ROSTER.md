# Agent Roster

## UI Agents (one per nav icon)
| Tab | Agent | Folder | Owns |
|-----|-------|--------|------|
| 1 | ui.recon | `ui-recon/` | Recon dashboard + 3 step pages |
| 2 | ui.intelligence | `ui-intelligence/` | Intelligence dashboard + 3 step pages |
| 3 | ui.hub | `ui-hub/` | Hub dashboard + 3 step pages |
| 4 | ui.content-gen | `ui-content-gen/` | Content Gen dashboard + 3 step pages |
| 5 | ui.agents | `ui-agents/` | Agents dashboard + 3 step pages |

## Feature Agents
| Tab | Agent | Folder | Owns |
|-----|-------|--------|------|
| 6 | feat.ai | `feat-ai/` | Adds AI features across all 5 dashboards (target: 3 per dashboard) |

## QA Agents
| Tab | Agent | Folder | Owns |
|-----|-------|--------|------|
| 7 | qa.performance | `qa-performance/` | Load time / FCP / lazy-loading audits |
| 8 | qa.architecture | `qa-architecture/` | File org, READMEs, component docs |
| 9 | qa.refactor | `qa-refactor/` | Code quality, dead code, naming, elegance |

## Coordination
- UI agents own their routes — no overlap.
- feat.ai reads all 5 ui-* folders to know where to add features.
- QA agents read across all ui-* folders and report findings into the relevant ui-* JOURNAL.md.
- The clients-pm agent (Shaan's planning brain) is the orchestrator — agents do not coordinate directly.
