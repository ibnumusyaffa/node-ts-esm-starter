import { pinoHttp, Options } from "pino-http"
import env from "@/shared/env.js"
import { randomUUID } from "crypto"

const config: Record<typeof env.NODE_ENV, Options> = {
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
    genReqId: function (req, res) {
      const id = randomUUID()
      res.setHeader("X-Request-Id", id)
      return id
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

export const httpLogger = pinoHttp(config.development)
export const logger = httpLogger.logger
