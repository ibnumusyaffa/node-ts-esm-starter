import "dotenv/config"
import express, { NextFunction, Request, Response } from "express"
import cors from "cors"
import { handleError } from "@/common/error.js"
import { httpLogger } from "@/common/logger.js"
import routes from "@/routes.js"
import env from "@/config/env.js"

const app = express()

app.use(httpLogger)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use("*", cors({ origin: "*" }))
app.use("/static", express.static("storage/public"))

app.use(routes)

app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
  handleError(error)

  if (env.APP_DEBUG) {
    if (error instanceof Error) {
      return res.status(500).json({
        message: error.message,
        stack: error.stack?.split("\n").map((s) => s.trim()),
      })
    }
    return res.status(500).json({
      message: "Unknown error",
      stack: [],
    })
  }

  return res.status(500).json({
    message: "Something went wrong",
  })
})

export default app
