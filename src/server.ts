import "dotenv/config"
import http from "http"
import app from "@/app.js"
import { handleError } from "@/shared/error.js"
import process from "node:process"

process.on("uncaughtException", async (err) => {
  await handleError(err)
  process.exit(1)
})

const PORT = process.env.PORT || 3000
const server = http.createServer(app)
server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`)
})
