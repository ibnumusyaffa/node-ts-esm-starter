import "dotenv/config"

import express from "express"
import cors from "cors"
import { errorHandler, showErrorLine } from "@/shared/middleware/error.js"
import { httpLogger } from "@/shared/logger.js"
import routes from "@/routes.js"

const app = express()
const PORT = process.env.PORT || 3000

app.use(httpLogger)
app.use("/static", express.static("storage/public"))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use("*", cors({ origin: "*" }))

app.use(routes)
app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`)
})

process.on("uncaughtException", async (err) => {
  showErrorLine(err)
  process.exit(1)
})
