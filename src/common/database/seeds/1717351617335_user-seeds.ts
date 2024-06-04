import { faker } from "@faker-js/faker"
import type { Kysely } from "kysely"
import bcrypt from "bcrypt"
import { NewUser } from "../types/user.js"

export async function seed(db: Kysely<any>): Promise<void> {
  const users: Array<NewUser> = []
  for (let i = 0; i < 100; i++) {
    let t = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: await bcrypt.hash(faker.internet.password({ length: 8 }), 10),
    }
    users.push(t)
  }

  await db.insertInto("users").values(users).execute()
}
