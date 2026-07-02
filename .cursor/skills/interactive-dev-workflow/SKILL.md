---
name: interactive-dev-workflow
description: >-
  Guides iterative app structuring by asking one question per turn, writing
  project Cursor rules, and implementing code that follows those rules. Use when
  the user wants step-by-step development, interactive architecture, develop
  with rules, or says to start the dev workflow. Stops only when the user says
  they are finished.
disable-model-invocation: true
---

# Interactive Dev Workflow

Step-by-step app development: **ask → rule → code → wait**. One decision per turn.

## When to use

Invoke when the user says: start dev workflow, interactive development, develop with rules, step by step, or names this skill.

## Exit phrases

Stop the loop only when the user says one of:

- `we are finished`
- `finished`
- `done with workflow`

Until then, always end with exactly one next question.

## Bootstrap (every session start)

1. Read [phases.md](phases.md) for the question bank
2. Read [rule-template.md](rule-template.md) before writing rules
3. Read the project's `package.json` and `.cursor/rules/*.mdc` if present
4. Read or create `.cursor/workflow-state.md` in the **current project**
5. If resuming: continue from `current_phase` / `current_step` in workflow-state
6. If new: set phase 0, step 1; ask the first unanswered question

## Core loop (one turn)

```
1. Check exit phrase → if matched, summarize session and stop
2. Ask ONE question (prefer AskQuestion tool)
3. WAIT for user answer (do not continue in same turn after asking)
```

**On the next turn** (after user answers):

```
4. Append decision to .cursor/workflow-state.md
5. Write or update ONE .cursor/rules/*.mdc rule for this decision
6. Implement minimal code that follows the new rule
7. Verify: `pnpm check` / lint if TS or Svelte changed
8. Output the per-turn summary template
9. State the next question (preview only — full question next turn if user continues)
```

## Hard constraints

| Rule                  | Detail                                                                      |
| --------------------- | --------------------------------------------------------------------------- |
| One question per turn | Never batch structure decisions                                             |
| Rule before code      | No implementation until `.mdc` exists for this decision                     |
| Minimal diff          | Only code required by the current answer                                    |
| Wait for user         | Stop after summary; do not auto-advance                                     |
| No duplication        | Extend existing rules; do not copy project-stack or framework rules         |
| Stack-aware           | Skip questions already answered by rules or code                            |
| Svelte                | Run Svelte MCP `svelte-autofixer` after editing `.svelte` files             |
| Rule format           | Follow create-rule skill — `.mdc`, YAML frontmatter, ~50 lines, one concern |

## Per-turn summary template

End every completed step with:

```markdown
## Step N — [topic]

**Your decision:** …

**Rule:** `.cursor/rules/[file].mdc` (created | updated)

**Code:** [files changed]

**Next question:** …
```

## workflow-state.md format

Create in the project's `.cursor/workflow-state.md`:

```markdown
# Workflow state

- **Project:** [name from package.json]
- **Phase:** 0–8
- **Step:** N
- **Status:** active | finished

## Decisions

- Step 1 (Phase 0): …

## Rules this session

- app-structure.mdc

## Files touched

- src/routes/+layout.svelte
```

Update after every answered question.

## Phase overview

| Phase | Topic                                          |
| ----- | ---------------------------------------------- |
| 0     | Bootstrap — app purpose, resume vs restart     |
| 1     | Routes — URL map, layouts, public vs protected |
| 2     | `$lib` — components, schemas, server layout    |
| 3     | Data — Drizzle tables, IDs, migrations         |
| 4     | Auth — Better Auth boundaries                  |
| 5     | Validation — Zod schemas                       |
| 6     | UI — daisyUI theme and shell                   |
| 7     | Features — one feature per sub-loop            |
| 8     | Polish — tests, SEO, i18n                      |

Full questions: [phases.md](phases.md). Pick the **next unanswered** question. User may skip a phase only by explicit request.

## Rule naming

| Decision  | File                 | Scope                         |
| --------- | -------------------- | ----------------------------- |
| Whole-app | `app-structure.mdc`  | `alwaysApply: true`           |
| Routes    | `routing.mdc`        | `globs: src/routes/**`        |
| Data      | `data-model.mdc`     | `globs: src/lib/server/db/**` |
| Feature   | `feature-[name].mdc` | targeted globs                |

Templates: [rule-template.md](rule-template.md).

## Skip logic

Before asking, check if already decided:

- `app-structure.mdc` or `routing.mdc` exists → skip matching phase questions
- Code in `src/routes/` reflects route decisions → skip route questions
- `src/lib/schemas/` exists → skip Zod location question

## Phase 7 feature sub-loop

For each feature, ask in order (one per turn):

1. What does this feature do?
2. Which routes and server files?
3. Data model changes?
4. UI components needed?

Write `feature-[name].mdc` then implement.
