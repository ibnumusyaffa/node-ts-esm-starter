import { pinoHttp, Options } from "pino-http"
import env from "@/config/env.js"
import { randomUUID } from "node:crypto"

const config: Record<typeof env.LOG_MODE, Options> = {
  development: {
    transport: {
      target: "pino-http-print",
      options: {
        colorize: true,
        all: true,
        translateTime: true,
        relativeUrl: false,
        lax: true,
      },
    },
  },
  production: {
    redact: ["req.headers.authorization"],
    genReqId: function (req, res) {
      const id = randomUUID()
      res.setHeader("X-Request-Id", id)
      return id
    },
  },
  test: {
    enabled: false,
  },
}

export const httpLogger = pinoHttp(config[env.LOG_MODE])
export const logger = httpLogger.logger
