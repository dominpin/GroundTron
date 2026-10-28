import type { Register } from 'claude-code'
import { link } from './compose'
import { themeConfigSet, themeSessionStart } from './theme'
import { register as blastRadius } from './blast/blast-radius.mjs'
import { register as savvyProgress, savvySessionStart, savvyTurnComplete, savvyTurnStep } from './savvy/register'
import {
  cacheTaxClassicSessionStart,
  cacheTaxPromptSubmit,
  cacheTaxSessionStart,
  cacheTaxTurnComplete,
  cacheTaxTurnStep,
  register as cacheTax,
} from './cachetax/register'
import {
  filetreeClassicSessionStart,
  filetreePromptSubmit,
  filetreeSessionStart,
  register as filetree,
} from './filetree/register'

// One mod, four parts. Hooks run in the order registered, the first outermost:
// Blast Radius holds a risky Bash call before the others see it run.
export const register: Register = (on, options) => {
  blastRadius(on)
  savvyProgress(on, options)
  cacheTax(on)
  filetree(on, options)

  // One reading of the theme setting (light/dark, NO_COLOR) for all four parts.
  on('config.set', { key: 'theme' }, ($, e, next) => themeConfigSet($, e, next))

  // The events several parts hook without a matcher, each hooked once here and
  // chained in the same order: the shared theme, savvy-progress, cache-tax, filetree.
  on('session.start', ($, e, next) =>
    themeSessionStart($, e, link(next, e0 =>
      savvySessionStart($, e0, link(next, e1 =>
        cacheTaxSessionStart($, e1, link(next, e2 =>
          filetreeSessionStart($, e2, next))))))))

  on('classic.SessionStart', ($, e, next) =>
    cacheTaxClassicSessionStart($, e, link(next, e1 =>
      filetreeClassicSessionStart($, e1, next))))

  // cache-tax's guard first: a cold send it stops never reaches the file tree.
  on('prompt.submit', ($, e, next) =>
    cacheTaxPromptSubmit($, e, link(next, e1 =>
      filetreePromptSubmit($, e1, next))))

  on('turn.complete', ($, e, next) =>
    savvyTurnComplete($, e, link(next, e1 =>
      cacheTaxTurnComplete($, e1, next))))

  on('turn.step', async function* ($, e, next) {
    return yield* savvyTurnStep($, e, link(next, e1 => cacheTaxTurnStep($, e1, next)))
  })
}
