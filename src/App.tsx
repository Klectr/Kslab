import { memo } from "kaioken"
import InfiniteCanvas from "./components/InfinateCanvas"
import { ToastContextProvider } from "./components/Toast"
import { useThemeDetector } from "./utils/useThemeDetector"

export function App() {
  useThemeDetector()

  return (
    <ToastContextProvider>
      <MemoInfyCanvas />
      <div id="context-menu-portal" />
    </ToastContextProvider>
  )
}

const MemoInfyCanvas = memo(InfiniteCanvas)
