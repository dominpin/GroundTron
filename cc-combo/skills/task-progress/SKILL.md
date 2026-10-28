---
name: task-progress
description: Show a progress bar above the prompt for any multi-step task. Use at the start of any task that needs three or more steps (implementing a feature, a refactor, an investigation with fixes), so the user sees how far along it is.
---

# Task progress bar

cc-combo draws a progress bar above the prompt from the `mcp__cc-combo__progress` tool. It is deferred: load it first with ToolSearch (`select:mcp__cc-combo__progress`).

For a task of three or more steps:

1. Right after you have a plan, call `mcp__cc-combo__progress` with `title` (a few words), `total` (the number of steps) and `done: 0`. Leave `tasks` and `phase` out.
2. After each step finishes, call it again with the new `done`. Fields you leave out keep their value. If the plan changes, send a new `total`.
3. When the whole task is finished, call it once with `finished: true`.

Skip the bar for one-step answers, questions and quick edits. Do not announce the calls to the user; they only draw the bar.
