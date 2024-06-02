import { drizzle } from "drizzle-orm/mysql2"
import mysql from "mysql2/promise"
import * as schema from "./schema.js"
import env from "@/config/env.js"

export const connection = mysql.createPool({
  host: env.DB_HOST,
  user: env.DB_USER,
  port: env.DB_PORT,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
})

export const db = drizzle(connection, { schema, mode: "default" })
