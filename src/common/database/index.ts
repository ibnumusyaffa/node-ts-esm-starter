import env from "@/config/env.js"
import { Database } from "./types/index.js"
import { createPool } from "mysql2"
import { Kysely, MysqlDialect } from "kysely"

export const pool = createPool({
  database: env.DB_NAME,
  host: env.DB_HOST,
  user: env.DB_USER,
  port: env.DB_PORT,
  password: env.DB_PASSWORD,
  connectionLimit: 10,
})
export const dialect = new MysqlDialect({
  pool,
})

export const db = new Kysely<Database>({
  dialect,
})
