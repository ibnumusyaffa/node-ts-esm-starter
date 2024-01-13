import "dotenv/config"
import app from "@/server.js"
import { showErrorLine } from "@/shared/middleware/error.js"
import process from "node:process"

process.on("uncaughtException", async (err) => {
  await showErrorLine(err)
  process.exit(1)
})

process.on("unhandledRejection", async (err) => {
  if (err instanceof Error) {
    await showErrorLine(err)
  }
  process.exit(1)
})

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`)
})
