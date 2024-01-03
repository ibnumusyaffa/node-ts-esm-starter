import "dotenv/config"
import type { Config } from "drizzle-kit"

export default {
  schema: "./src/shared/db/schema.ts",
  out: "./src/shared/db/migrations",
  driver: "mysql2",
  dbCredentials: {
    host: process.env.DB_HOST as string,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME as string,
  },
} satisfies Config
