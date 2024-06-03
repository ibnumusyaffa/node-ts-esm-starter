import { faker } from "@faker-js/faker"
import { db } from "@/common/database/index.js"
import bcrypt from "bcrypt"

export async function createUser() {
  const user = {
    name: faker.person.fullName(),
    email: faker.internet.email(),
    password: faker.internet.password({ length: 8 }),
  }
  await db
    .insertInto("users")
    .values({
      name: user.name,
      email: user.email,
      password: await bcrypt.hash(user.password, 10),
    })
    .execute()

  const createdUser = await db
    .selectFrom("users")
    .where("email", "=", user.email)
    .selectAll()
    .executeTakeFirst()

  if (!createdUser) {
    throw new Error("created user is not found")
  }

  return { ...user, id: createdUser.id }
}
