import "dotenv/config"
import { parseEnv, z, port } from "znv"

export const env = parseEnv(process.env, {
  //App
  NODE_ENV: z
    .enum(["production", "development", "test"])
    .default("development"),
  PORT: port().default(3000),

  APP_NAME: z.string().default("MyApp"),
  APP_KEY: z.string(),
  APP_DEBUG: z.boolean().default(true),
  APP_URL: z.string().default("http://localhost:3000"),

  //DB
  DB_USER: z.string(),
  DB_HOST: z.string(),
  DB_PORT: port(),
  DB_PASSWORD: z.string(),
  DB_NAME: z.string(),

  //Redis
  REDIS_HOST: z.string(),
  REDIS_PASSWORD: z.string(),
  REDIS_PORT: port(),

  //rabbitMQ
  RABBITMQ_HOST: z.string(),
  RABBITMQ_PORT: port(),
  RABBITMQ_USERNAME: z.string(),
  RABBITMQ_PASSWORD: z.string(),

  //Mail
  MAIL_HOST: z.string(),
  MAIL_PORT: z.number(),
  MAIL_USERNAME: z.string(),
  MAIL_PASSWORD: z.string(),
  MAIL_FROM_NAME: z.string(),
  MAIL_FROM_ADDRESS: z.string(),
})

export default env
