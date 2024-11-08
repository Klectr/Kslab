import { sideEffectsEnabled, useHook } from "kaioken"
import { noop } from "kaioken/utils"

type UseDebounceState = {
  timer: NodeJS.Timeout | undefined
  debounce: (func: (...args: unknown[]) => void, timeout?: number) => void
}

function createState(): UseDebounceState {
  return { timer: undefined, debounce: noop }
}

export function useDebounce() {
  if (!sideEffectsEnabled()) return createState()

  return useHook("useDebounce", createState, ({ hook, update, isInit }) => {
    if (!isInit) return { timer: hook.timer, debounce: hook.debounce }

    hook.debounce = function debounce(
      func: (...args: unknown[]) => void,
      timeout = 300
    ) {
      clearTimeout(hook.timer)
      hook.timer = setTimeout(() => {
        func.apply(this)
      }, timeout)
      update()
    }

    return { timer: hook.timer, debounce: hook.debounce }
  })
}
