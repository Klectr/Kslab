import { memo } from "kaioken"
import InfiniteCanvas from "./components/InfinateCanvas"
import { ToastContextProvider } from "./components/Toast"
import { useThemeDetector } from "./utils/useThemeDetector"

export function App() {
  useThemeDetector()

  return (
    <ToastContextProvider>
      <MemoInfyCanvas />
    </ToastContextProvider>
  )
}

const MemoInfyCanvas = memo(InfiniteCanvas)
