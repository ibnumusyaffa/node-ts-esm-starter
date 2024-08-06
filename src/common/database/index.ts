import env from "@/config/env.js"
import { Database } from "@/common/database/types/index.js"
import { createPool } from "mysql2"
import { Kysely, MysqlDialect, Migrator } from "kysely"
import path from "node:path"
import { TSFileMigrationProvider } from "kysely-ctl"

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

export async function migrate() {
  const migrator = new Migrator({
    db,
    provider: new TSFileMigrationProvider({
      migrationFolder: path.join(import.meta.dirname, "./migrations"),
    }),
  })

  const { error, results } = await migrator.migrateToLatest()

  if (results)
    for (const item of results) {
      if (item.status === "Error") {
        console.error(`failed to execute migration "${item.migrationName}"`)
      }
    }

  if (error) {
    console.error("failed to run `migrateToLatest`")
    console.error(error)
  }
}
