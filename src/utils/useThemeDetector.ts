import { useEffect, useState } from "kaioken"

export function useThemeDetector() {
  const [isDarkTheme, setIsDarkTheme] = useState<boolean>(getCurrentTheme())
  function getCurrentTheme() {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
  }

  const mqListener = (e: MediaQueryListEvent) => {
    setIsDarkTheme(e.matches)
  }

  useEffect(() => {
    const darkThemeMq = window.matchMedia("(prefers-color-scheme: dark)")
    darkThemeMq.addListener(mqListener)
    return () => darkThemeMq.removeListener(mqListener)
  }, [])

  return isDarkTheme
}
