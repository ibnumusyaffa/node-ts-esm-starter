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

app.use(async (error: unknown, req: Request, res: Response) => {
  const instanceOfError = error instanceof Error
  if (instanceOfError) {
    await handleError(error)
  }

  if (env.APP_DEBUG) {
    return res.status(500).send({
      message: instanceOfError ? error.message : "Unknown error",
      stack: instanceOfError ? error.stack : "",
    })
  }

  return res.status(500).send({
    message: "Something went wrong",
  })
})

export default app
