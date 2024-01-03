import "dotenv/config"
import { migrate } from "drizzle-orm/mysql2/migrator"
import { db, connection } from "./index.js"

await migrate(db, { migrationsFolder: "./src/shared/db/migrations" })
await connection.end()
