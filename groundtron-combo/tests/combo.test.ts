import { describe, expect, mock, test } from 'claude-code/testing'
import type { CommandRunInput, On, RenderPropsOf, SessionStartInput } from 'claude-code'

const START = 1_000_000

// The engine beneath the mod: what each of the four parts asks of it at the
// start of a session, recorded so the tests can see every part had its turn.
function world(on: On, theme = 'dark') {
  const clock = mock.clock(on, { now: START })
  mock.store(on, {})
  mock.env(on, { OS: 'Linux', HOME: '/home/me' })
  const commands: string[] = []
  const tools: string[] = []
  const entered: string[] = []
  const finished: string[] = []
  on('command.register', ($, e) => { commands.push(e.name); return { value: { command: e.name } } })
  on('command.list', () => ({ value: [] }))
  on('tool.register', ($, e) => { tools.push(e.name); return { value: { name: `mcp__groundtron-combo__${e.name}` } } as never })
  on('settings.read', () => ({ value: {} }) as never)
  on('config.list', () => ({ value: [{ key: 'theme', label: 'Theme', kind: 'choice', value: theme, provider: { plugin: 'engine', tier: 'core' }, isLocked: false }] }) as never)
  on('ui.render', ($, e) => $.ui.resolve(e).Text({ children: [''] }))
  on('ui.status', () => ({ value: undefined }))
  on('model.fork', () => ({ value: { isAnswered: false, reason: 'nothing-to-fork' } }) as never)
  on('session.start', ($, e) => ({ cwd: e.cwd }))
  on('session.id', () => ({ value: 'S1' }))
  on('session.cwd', () => ({ value: '/work' }))
  on('session.model', () => ({ value: 'claude-opus-5-5' }))
  on('session.usage', () => ({ value: { startedAt: START, context: { window: 1000000, tokens: undefined }, rateLimits: [] } }))
  on('prompt.submit', ($, e) => { entered.push(e.text); return { text: e.text } })
  on('turn.complete', ($, e) => { finished.push(e.turnId); return { text: 'answer' in e ? e.answer : '' } })
  on('fs.stat', () => { throw new Error('ENOENT') })
  on('fs.read', () => { throw new Error('ENOENT') })
  on('fs.list', () => ({ value: [] }) as never)
  on('process.run', () => ({ value: { code: 1, stdout: '', stderr: '' } }) as never)
  on('ui.open', () => ({ value: { isPlaced: false } }) as never)
  return { clock, commands, tools, entered, finished }
}

const session: SessionStartInput = { surface: null, isInteractive: false, cwd: '/work' }

describe('groundtron-combo', () => {
  test('one session.start reaches all three parts that hook it', async ($, on) => {
    const w = world(on)
    await $.session.start(session)
    await w.clock.settle()
    expect(w.commands).toContain('agents-info')
    expect(w.commands).toContain('keepwarm')
    expect(w.commands).toContain('cache-tax')
    expect(w.commands).toContain('filetree')
    expect(w.tools).toEqual(['progress', 'step'])
    await w.clock.settle()
  })

  test('a prompt passes through cache-tax and the file tree to the engine', async ($, on) => {
    const w = world(on)
    await $.session.start(session)
    await w.clock.settle()
    const r = await $.prompt.submit({ text: 'hello', wait: false, origin: { kind: 'composer' } })
    expect(w.entered).toEqual(['hello'])
    expect('drop' in r ? r.drop : undefined).toBeUndefined()
    await w.clock.settle()
  })

  test('a turn completes through savvy-progress and cache-tax', async ($, on) => {
    const w = world(on)
    await $.session.start(session)
    await w.clock.settle()
    await $.turn.complete({
      answer: 'ok', durationMs: 1000, isAborted: false, turnId: 't1', reason: 'answer',
      usage: { input_tokens: 2, output_tokens: 10, cache_read_input_tokens: 0, cache_creation_input_tokens: 500, model: 'claude-opus-5-5' },
    })
    expect(w.finished).toEqual(['t1'])
    await w.clock.settle()
  })

  // Both rows above the prompt share one look: a marker in the palette's colour, the
  // name beside it, and the colours of one palette, dark or light as the theme says.
  for (const [theme, accent, success] of [['dark', '#D97757', '#5FBF8F'], ['light', '#B8532F', '#1E7B4F']] as const) {
    test(`${theme}: the progress row and the cache row are drawn alike`, async ($, on) => {
      const w = world(on, theme)
      await $.session.start({ surface: 'terminal', isInteractive: true, cwd: '/work' })
      await w.clock.settle()
      await $.command.run(run('keepwarm', '90m'))
      await $.tool.call({ tool: 'mcp__groundtron-combo__progress', title: 'Demo', total: 4, done: 1, phase: 'delegate' } as never)
      // A turn that read the cache: cache-tax now knows it is warm.
      await $.turn.complete({
        answer: 'ok', durationMs: 1000, isAborted: false, turnId: 't1', reason: 'answer',
        usage: { input_tokens: 2, output_tokens: 10, cache_read_input_tokens: 200000, cache_creation_input_tokens: 500, model: 'claude-opus-5-5' },
      })
      const ui = await $.ui.mount({ plugin: 'groundtron-combo', surface: 'terminal', component: 'AbovePrompt', props: bandProps })
      const marks = await ui.findAll({ type: 'Text', text: /^● $/ })
      expect(marks.map(m => m.props.color)).toEqual([accent, success])
      expect(await ui.find({ type: 'Text', text: 'Demo' })).toBeDefined()
      expect(await ui.find({ type: 'Text', text: 'cache-tax' })).toBeDefined()
      await w.clock.settle()
    })
  }
})

// The bar moves with the workers, not only when the orchestrator reports: a worker
// that finishes, or reports a step, moves it at once, one task at a time.
describe('progress bar', () => {
  test('grows task by task from what the agents do', async ($, on) => {
    const w = world(on)
    let n = 0
    on('agent.spawn', () => ({ agentId: 'A' + ++n, model: 'claude-sonnet-5-5' }) as never)
    await $.session.start({ surface: 'terminal', isInteractive: true, cwd: '/work' })
    await w.clock.settle()
    await $.tool.call({
      tool: 'mcp__groundtron-combo__progress', title: 'Demo', phase: 'delegate',
      tasks: [{ title: 'one', tier: 'light' }, { title: 'two', tier: 'light' }, { title: 'three', tier: 'light' }],
    } as never)
    const ui = await $.ui.mount({ plugin: 'groundtron-combo', surface: 'terminal', component: 'AbovePrompt', props: bandProps })
    const shown = async () => (await ui.find({ type: 'Text', text: /\d\/3|\d+%/ }))?.text ?? ''
    const bar = async () => (await ui.find({ type: 'Text', text: /[█▒░]{4}/ }))?.text ?? ''
    const spawn = (description: string) => $.agent.spawn({ subagentType: 'savvy-light', description, prompt: 'do it', tool_use_id: description } as never)

    await spawn('one')
    await spawn('two')
    const started = await bar()
    expect(started).toContain('▒')             // two workers running: the lighter layer
    expect(started).not.toContain('█')          // nothing finished yet

    // The first worker finishes. The orchestrator has reported nothing.
    await $.turn.complete({ answer: 'ok', durationMs: 1, isAborted: false, turnId: 'a', reason: 'answer', agentId: 'A1',
      usage: { input_tokens: 1, output_tokens: 1, cache_read_input_tokens: 0, cache_creation_input_tokens: 0, model: 'claude-sonnet-5-5' } } as never)
    expect(await shown()).toContain('1/3')

    // The second worker reports it is halfway: the bar sits between 1 and 2 of 3.
    await $.tool.call({ tool: 'mcp__groundtron-combo__step', agentId: 'A2', done: 1, total: 2 } as never)
    const half = await bar()
    const filled = (half.match(/█/g) ?? []).length
    const all = half.length
    expect(filled / all).toBeGreaterThan(1 / 3)
    expect(filled / all).toBeLessThan(2 / 3)
    await w.clock.settle()
  })
})

const run = (command: string, args: string): CommandRunInput => ({
  command, args, origin: { kind: 'composer' }, presentation: { isFullscreen: false, columns: 80 },
})

const bandProps: RenderPropsOf['AbovePrompt'] = {
  hasSurvey: false, isWorking: false, maxRows: 10, bodyColumns: 100,
  scroll: { offset: 0, bodyRows: 10 }, view: {},
}
