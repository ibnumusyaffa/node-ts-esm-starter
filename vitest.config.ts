import { defineConfig } from "vitest/config"
import tsconfigPaths from "vite-tsconfig-paths"

export default defineConfig({
  test: {
    setupFiles:['./src/tests/utils/vitest-setup.ts'],
    globalSetup:['./src/tests/utils/global-setup.ts']
  },
  plugins: [tsconfigPaths()],
})
