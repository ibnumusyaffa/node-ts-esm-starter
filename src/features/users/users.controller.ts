import { logger } from "@/shared/logger.js"
import { Request, Response, NextFunction } from "express"
import { forgotPassword } from "./jobs/users.queue.js"

export async function list(req: Request, res: Response, next: NextFunction) {
  try {
    req.log.info("log pino with request")
    logger.info("log pino with default pino")
    await forgotPassword({
      name: "ibnu",
      email: "ibnu.musyaffa@gmail.com",
      link: "http://example.app/reset-password",
    })
    return res.send({ message: "Hello from users" })
  } catch (error) {
    return next(error)
  }
}

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    return res.send({ message: "Hello from users" })
  } catch (error) {
    return next(error)
  }
}
