import { defineConfig } from "vitest/config"
import tsconfigPaths from "vite-tsconfig-paths"

export default defineConfig({
  test: {
    globalSetup:['./src/tests/utils/global-setup.ts']
  },
  plugins: [tsconfigPaths()],
})
