import "dotenv/config"
import express from "express"
import cors from "cors"
import { errorHandler } from "@/shared/middleware/error.js"
import { httpLogger } from "@/shared/logger.js"
import routes from "@/routes.js"

const app = express()

app.use(httpLogger)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use("*", cors({ origin: "*" }))

app.use("/static", express.static("storage/public"))
app.use(routes)
app.use(errorHandler)

export default app
