import "dotenv/config"
import express, { NextFunction, Request, Response } from "express"
import cors from "cors"
import { handleError } from "@/libs/error.js"
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

app.use(
  async (error: unknown, req: Request, res: Response, next: NextFunction) => {
    if (error instanceof Error) {
      await handleError(error)
    }

    if (env.APP_DEBUG && error instanceof Error) {
      return res.status(500).send({
        message: error.message,
        stack: error.stack,
      })
    }
    return res.status(500).send({
      message: "internal server error",
    })
  }
)

export default app
