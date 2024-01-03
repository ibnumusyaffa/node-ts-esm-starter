import { pinoHttp } from "pino-http"

const config = {
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
  },
}

const env = String(process.env.NODE_ENV)
export const httpLogger = pinoHttp(config[env])
export const logger = httpLogger.logger
