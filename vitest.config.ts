import { defineConfig } from "vitest/config"
import tsconfigPaths from "vite-tsconfig-paths"

export default defineConfig({
  test: {
    globalSetup:['src/global-setup.ts']
  },
  plugins: [tsconfigPaths()],
})
