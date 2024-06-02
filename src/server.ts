import "dotenv/config"
import http from "http"
import app from "@/app.js"
import { handleError } from "@/common/error.js"
import process from "node:process"
import env from "@/config/env.js"

process.on("uncaughtException", async (err) => {
  await handleError(err)
  process.exit(1)
})

const PORT = env.PORT || 3000
const server = http.createServer(app)
server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`)
})
