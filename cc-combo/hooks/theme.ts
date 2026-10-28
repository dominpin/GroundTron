import type { HookArgs } from './compose'

// The one look of all four parts: one palette, one light/dark reading, one
// NO_COLOR rule, and one shape for a row in the band above the prompt.
//
// Before, cache-tax and filetree each read the theme setting on their own,
// only cache-tax honoured NO_COLOR, and every part had its own reds, greens
// and accents. Now this module reads the setting once and the parts ask it.

export type Palette = {
  /** Claude's clay: the progress bar, folders, the file tree's header. */
  accent: string | undefined
  /** Finished, warm, added. */
  success: string | undefined
  /** Needs a look: a cold cache, a held command, a modified file. */
  warning: string | undefined
  /** Failed, deleted, would destroy. */
  danger: string | undefined
  /** Renamed, copied, neutral highlights. */
  info: string | undefined
  /** Secondary text. */
  muted: string | undefined
}

const DARK: Palette = {
  accent: '#D97757',
  success: '#5FBF8F',
  warning: '#E5C07B',
  danger: '#E06C75',
  info: '#61AFEF',
  muted: '#8A8F98',
}

// Darker on a light terminal so each still reads against white.
const LIGHT: Palette = {
  accent: '#B8532F',
  success: '#1E7B4F',
  warning: '#8A5A00',
  danger: '#B42318',
  info: '#1E4FA3',
  muted: '#5B6270',
}

const NONE: Palette = { accent: undefined, success: undefined, warning: undefined, danger: undefined, info: undefined, muted: undefined }

let lightTerminal = false
let noColor = false

/** The band's marker and separator, shared by every row above the prompt. */
export const MARK = '●'
export const SEP = ' · '

/** Light only on a terminal whose theme is light: the desktop draws on its own dark-aware surface. */
export function isLight(surface?: string | null): boolean {
  return lightTerminal && surface !== 'desktop'
}

export function isNoColor(): boolean {
  return noColor
}

export function palette(surface?: string | null): Palette {
  if (noColor) return NONE
  return isLight(surface) ? LIGHT : DARK
}

/** The full palette whatever NO_COLOR says, for drawings that need a colour (an SVG). */
export function solid(surface?: string | null): Palette {
  return isLight(surface) ? LIGHT : DARK
}

function readTheme(value: unknown): boolean {
  return typeof value === 'string' && value.startsWith('light')
}

export async function themeSessionStart($: HookArgs<'session.start'>[0], e: HookArgs<'session.start'>[1], next: HookArgs<'session.start'>[2]) {
  const started = await next(e)
  try {
    lightTerminal = readTheme((await $.config.list()).find(row => row.key === 'theme')?.value)
    noColor = Boolean(await $.env.get('NO_COLOR'))
    if (lightTerminal || noColor) $.ui.invalidate('ui.render')
  } catch {
    // Keep the dark palette.
  }
  return started
}

export async function themeConfigSet($: HookArgs<'config.set'>[0], e: HookArgs<'config.set'>[1], next: HookArgs<'config.set'>[2]) {
  const result = await next(e)
  if (result.deny === undefined) {
    const light = readTheme(result.value)
    if (light !== lightTerminal) {
      lightTerminal = light
      $.ui.invalidate('ui.render')
    }
  }
  return result
}
