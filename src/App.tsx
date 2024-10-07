import InfiniteCanvas from "./components/InfinateCanvas"
import { useThemeDetector } from "./utils/useThemeDetector"

export function App() {
  useThemeDetector()

  return <InfiniteCanvas />
}
