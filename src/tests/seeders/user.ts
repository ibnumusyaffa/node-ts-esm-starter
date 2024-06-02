import { faker } from "@faker-js/faker"
import { users } from "@/common/database/schema.js"
import { db } from "@/common/database/index.js"
import { eq, and } from "drizzle-orm"
import bcrypt from "bcrypt"

export async function createUser() {
  const user = {
    name: faker.person.fullName(),
    email: faker.internet.email(),
    password: faker.internet.password({ length: 8 }),
  }
  await db.insert(users).values({
    name: user.name,
    email: user.email,
    password: await bcrypt.hash(user.password, 10),
  })

  const createdUser = await db.query.users.findFirst({
    where: and(eq(users.email, user.email)),
  })

  if (!createdUser) {
    throw new Error("created user is not found")
  }

  return { ...user, id: createdUser.id }
}
