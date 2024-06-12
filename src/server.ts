import "dotenv/config"
import { handleError } from "@/common/error.js"
import env from "@/config/env.js"
import http from "node:http"
import process from "node:process"
import app from "@/app.js"

process.on("uncaughtException", (err) => {
  handleError(err)
  process.exit(1)
})

const PORT = env.PORT || 3000
const server = http.createServer(app)
server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`)
})
