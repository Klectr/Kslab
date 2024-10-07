export function isTheme(value: "light" | "dark") {
  return window.matchMedia(`(prefers-color-scheme: ${value})`).matches
}
