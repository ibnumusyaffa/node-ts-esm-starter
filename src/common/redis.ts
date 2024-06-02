import { Redis } from "ioredis"
import env from "@/config/env.js"

export const connection = new Redis({
  maxRetriesPerRequest: null,
  host: env.REDIS_HOST,
  port: env.REDIS_PORT,
  password: env.REDIS_PASSWORD,
})
