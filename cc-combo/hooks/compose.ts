// One plugin may hook an event without a matcher only once, but three of the
// four parts hook the same events (session.start, turn.step, ...). register.tsx
// hooks each such event once and runs the parts' hooks as one chain:
//
//   on('session.start', ($, e, next) => a($, e, link(next, e1 => b($, e1, next))))
//
// `link(next, rest)` is the `next` a part sees: calling it runs `rest` (the
// parts beneath), and every other field (signal, to, is, origin, budget, ...)
// is the engine's own.
export function link<N extends (...args: any[]) => any>(next: N, rest: (e: Parameters<N>[0]) => ReturnType<N>): N {
  return new Proxy(next, {
    apply: (_target, _this, args) => rest(args[0]),
  })
}

// A shared-event hook's parameters, for the parts' function declarations
// (the engine follows `$` past an import only into a function declaration).
export type HookArgs<E extends keyof import('claude-code').Events> = Parameters<import('claude-code').Hook<E>>
