import { NextFunction, Request, Response } from "express"
import "dotenv/config"
import Youch from "youch"
import forTerminal from "youch-terminal"

export async function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (process.env.NODE_ENV === "development") {
    await showErrorLine(err)
  }

  return res.status(500).send({
    message: err.message,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  })
}

export async function showErrorLine(err: Error) {
  const jsonError = await new Youch(err, {}).toJSON()
  console.log(forTerminal(jsonError))
}
