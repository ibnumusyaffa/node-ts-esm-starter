import { expect, test, beforeAll, afterAll } from "vitest"
import request from "supertest"
import app from "@/app.js"
import { faker } from "@faker-js/faker"
import { db } from "@/common/database/index.js"
import bcrypt from "bcrypt"
import { describe } from "node:test"

beforeAll(async () => {
  // console.log("beforeAll")
})

describe("auth", () => {
  test("can login with valid data", async () => {
    // create user
    const user = await createUser()
    // login
    const respLogin = await request(app).post("/auth/login").send({
      email: user.email,
      password: user.password,
    })
    // profile
    const respProfile = await request(app)
      .get("/auth/profile")
      .auth(respLogin.body.token, { type: "bearer" })

    expect(user.name).toBe(respProfile.body.name)
  })
})

describe("auth1", () => {
  test("can login with valid data1", async () => {
    // create user
    const user = await createUser()
    // login
    const respLogin = await request(app).post("/auth/login").send({
      email: user.email,
      password: user.password,
    })
    // profile
    const respProfile = await request(app)
      .get("/auth/profile")
      .auth(respLogin.body.token, { type: "bearer" })

    expect(user.name).toBe(respProfile.body.name)
  })
})

async function createUser() {
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

afterAll(() => {
  // console.log("afterAll")
})
