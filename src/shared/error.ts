import "dotenv/config"
import Youch from "youch"
import forTerminal from "youch-terminal"
import { logger } from "./logger.js"
import env from "@/shared/env.js"
export async function handleError(err: Error) {
  if (env.APP_DEBUG) {
    await prettyError(err)
  }
  logger.error(err)
}

export async function prettyError(err: Error) {
  const jsonError = await new Youch(err, {}).toJSON()
  console.log(forTerminal(jsonError))
}
