import type { Kysely } from "kysely"
import bcrypt from "bcrypt"

export async function seed(db: Kysely<any>): Promise<void> {
  await db
    .insertInto("users")
    .values({
      name: "admin",
      email: "admin@example.com",
      password: await bcrypt.hash("Password123*", 10),
    })
    .execute()
}
