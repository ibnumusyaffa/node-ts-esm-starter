import "dotenv/config"
import express, { NextFunction, Request, Response } from "express"
import cors from "cors"
import { handleError } from "@/shared/error.js"
import { httpLogger } from "@/shared/logger.js"
import routes from "@/routes.js"

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

    if (process.env.NODE_ENV === "development" && error instanceof Error) {
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
