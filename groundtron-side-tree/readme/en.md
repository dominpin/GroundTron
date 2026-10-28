# GroundTron Side Tree

A Chrome / Brave / Firefox extension that adds a panel on the right side of `claude.ai`.
Same look and colours as the [groundtron-combo](https://github.com/dominpin/GroundTron) mod.

## What it shows

**Files** — a tree of the files touched in this conversation, built from the tool calls
visible in the transcript (`Read(...)`, `Edit(...)`, `Write(...)`, `Update(...)`,
`Grep`, `Glob`). The colour tells what happened to the file:

| | |
| --- | --- |
| `◦` blue | read |
| `●` clay | edited |
| `✚` green | created |
| `·` grey | only mentioned |

- When Claude has just opened or changed a file, its row lights up in the colour of the
  action and keeps a bar at the side for 8 seconds. The number on the right is the touch count.
- The **follow** toggle scrolls the tree to the file touched last.
- Clicking a file scrolls the conversation to the last place that file appears and briefly
  highlights it.
- The triangle next to a folder collapses and expands it. What you collapsed is remembered
  in the browser.

**The meter at the top** — in the spirit of `cache-tax`: the rough size of the thread and the
idle time, and from them a guess at the cache state (fresh / may be cold / most likely cold).
These are **estimates from what is visible on the page**. The extension cannot see the real
cache or the real token count, so it shows no costs in money and sends nothing to keep the
cache warm. The cross on the same line collapses the whole panel.

**The progress bar** — under the meter, in the style of the Windows 7 progress bar. The
extension reads the last task list visible in the conversation (`[x]` / `[ ]` or `☑` / `☐`).
With no such list there is no bar, because a percentage cannot be guessed. The numbers show in
a tooltip on hover.

**Hints** — a tab for writing prompts, based on three Anthropic pages (Prompt engineering
overview, Prompting best practices, Prompt library). You write your prompt in the message box
and six patterns tick themselves from your words: whether you describe the outcome, and
whether you give a way to verify, a reference, a measurable goal, an artifact and the format
of the answer. A missing pattern shows why it helps, and a click inserts an example into the
box. Below are five ready-made prompts (a click puts them in the box) and the principles from
the docs. The ticks are counted from words, so they are a hint, not a grade.

## Installation

### Chrome / Brave

1. `chrome://extensions` (in Brave `brave://extensions`), turn on **Developer mode**.
2. **Load unpacked** and point to this folder.

Chrome prints a warning about the unknown key `browser_specific_settings` — that key is for
Firefox, and the extension works despite it.

### Firefox

1. `about:debugging#/runtime/this-firefox`.
2. **Load Temporary Add-on** and point to `manifest.json` in this folder.

A temporary add-on disappears when the browser restarts. To keep it, it has to be signed on
`addons.mozilla.org`.

## Permissions

None. `manifest.json` has no `permissions` section: the extension only reads the `claude.ai`
page, which is on screen anyway, and stores the panel's settings (collapsed, tab, width,
collapsed folders) in that page's `localStorage`, under keys starting with `cst:`. It sends
nothing anywhere.

## What I have not verified

- I **tested the extension only on my own test page**, not on `claude.ai`. How the transcript
  shows tool calls and task lists may differ, and then the tree will be empty or incomplete
  and there will be no progress bar.
- The tree makes sense where Claude touches files, that is in Claude Code in the browser.
  In an ordinary chat there is usually nothing to collect.
- The "cold cache" threshold (5 minutes, then an hour) is my assumption, not a reading.
