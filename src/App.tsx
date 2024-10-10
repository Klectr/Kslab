import InfiniteCanvas from "./components/InfinateCanvas"
import { ToastContextProvider } from "./components/Toast"
import { useThemeDetector } from "./utils/useThemeDetector"

export function App() {
  useThemeDetector()

  return (
    <ToastContextProvider>
      <InfiniteCanvas />
    </ToastContextProvider>
  )
}
