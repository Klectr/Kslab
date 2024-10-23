import { defineConfig } from "vite"
import kaioken from "vite-plugin-kaioken"
import eslint from "vite-plugin-eslint"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    kaioken(),
    eslint({
      cache: true,
      exclude: ["src-tauri/**/*"],
      emitError: true,
      emitWarning: true,
      failOnError: false,
      failOnWarning: false,
      lintOnStart: true,
    }),
  ],
  // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
  //
  // 1. prevent vite from obscuring rust errors
  clearScreen: false,
  // 2. tauri expects a fixed port, fail if that port is not available
  server: {
    port: 1420,
    strictPort: true,
    watch: {
      // 3. tell vite to ignore watching `src-tauri`
      ignored: ["**/src-tauri/**"],
    },
  },
})
