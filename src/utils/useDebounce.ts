import { sideEffectsEnabled, useHook } from "kaioken"
import { noop } from "kaioken/utils"

type UseDebounceState = {
  timer: number
  debounce: (this: any, func: Function, timeout?: number) => void
}

function createState(): UseDebounceState {
  return { timer: 0, debounce: noop }
}

export function useDebounce() {
  if (!sideEffectsEnabled()) return createState()

  return useHook("useDebounce", createState, ({ hook, update, isInit }) => {
    if (!isInit) return { timer: hook.timer, debounce: hook.debounce }

    hook.debounce = function debounce(
      this: any,
      func: Function,
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
