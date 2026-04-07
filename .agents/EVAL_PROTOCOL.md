# Worker Eval Protocol

Every worker agent must follow this protocol before reporting a task as complete.

## Step 1 — Send EVAL_REQUEST to your section evaluator

When you believe you've finished a task, do NOT report to Manager yet.
Instead, send an EVAL_REQUEST to your section's evaluator surface:

| Section | Evaluator Surface |
|---------|-------------------|
| RECON | surface:103 |
| INTELL | surface:104 |
| HUB | surface:106 |
| CONTENT GEN | surface:105 |
| AGENTS | surface:107 |

```bash
cmux send --workspace <your-workspace> --surface <evaluator-surface> "EVAL_REQUEST
Worker: <your agent id> (surface:<your-surface>)
Task: <task name>
Spec: <list requirements from the task>
Files changed: <list every file you touched>"
cmux send-key --workspace <your-workspace> --surface <evaluator-surface> enter
```

## Step 2 — Wait for EVAL_RESULT

Poll the evaluator by reading its screen:

```bash
cmux read-screen --workspace <your-workspace> --surface <evaluator-surface> --scrollback --lines 20
```

Wait ~30 seconds between polls. The evaluator will respond with either:

```
EVAL_RESULT: PASS
```
or
```
EVAL_RESULT: FAIL
Issues: ...
Action required: ...
```

## Step 3a — PASS

Notify your Manager directly in their chat:

```bash
cmux send --workspace <your-workspace> --surface <manager-surface> "TASK_DONE | <your-agent-id> (<your-surface>) | <task name> | EVAL:PASS | <one-line summary of what changed>"
cmux send-key --workspace <your-workspace> --surface <manager-surface> enter
```

| Section | Manager Surface |
|---------|----------------|
| RECON | surface:91 |
| INTELL | surface:92 |
| HUB | surface:93 |
| CONTENT GEN | surface:94 |
| AGENTS | surface:95 |

The manager's Claude receives this as a live message and knows you're done.

## Step 3b — FAIL

Read the issues list carefully. Fix every issue listed. Then go back to Step 1 and resubmit.

Do NOT report complete until you receive EVAL_RESULT: PASS.

## Important

- Never skip the eval loop, even if you're confident the work is correct.
- The evaluator runs `tsc --noEmit` — type errors will be caught.
- Fabricated data (SEED_ constants, hardcoded returns) will be caught.
- The evaluator is on your side — its job is to help you ship correct work.
