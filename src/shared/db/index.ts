import { drizzle } from "drizzle-orm/mysql2"
import mysql from "mysql2/promise"
import * as schema from "./schema.js"

export const connection = mysql.createPool({
  host: process.env.DB_HOST as string,
  user: process.env.DB_USER,
  port: parseInt(process.env.DB_PORT as string),
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME as string,
})

export const db = drizzle(connection, { schema, mode: "default" })
