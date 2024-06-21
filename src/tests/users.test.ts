import request from "supertest"
import app from "@/app.js"
import { faker } from "@faker-js/faker"
import { createToken } from "@/common/auth.js"
import { createUser } from "./seeders/user.js"
import { expect, test, describe } from "vitest"

const loginUser = await createUser()

describe("create user", () => {
  test("can create with valid data", async () => {
    const fake = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password({ length: 8 }),
    }
    const response = await request(app)
      .post("/users")
      .auth(createToken(loginUser.email), { type: "bearer" })
      .send(fake)

    expect(response.status).toBe(201)
    await expect({ name: fake.name, email: fake.email }).toHaveRowInTable(
      "users"
    )
  })
  test("cant create with invalid data", async () => {
    const response = await request(app)
      .post("/users")
      .auth(createToken(loginUser.email), { type: "bearer" })
      .send({
        email: "",
      })

    expect(response.status).toBe(422)
  })
})

describe("list users", () => {
  test("list users works", async () => {
    const response = await request(app)
      .get("/users")
      .auth(createToken(loginUser.email), { type: "bearer" })

    expect(Array.isArray(response.body.data)).toBe(true)
  })
})

describe("detail user", () => {
  test("with valid id", async () => {
    const detailResponse = await request(app)
      .get(`/users/${loginUser.id}`)
      .auth(createToken(loginUser.email), { type: "bearer" })

    expect(detailResponse.status).toBe(200)
    expect(detailResponse.body.email).toBe(loginUser.email)
    expect(detailResponse.body.name).toBe(loginUser.name)
  })

  test("with invalid id", async () => {
    const detailResponse = await request(app)
      .get(`/users/0`)
      .auth(createToken(loginUser.email), { type: "bearer" })

    expect(detailResponse.status).toBe(404)
  })
})

describe("DELETE /user", () => {
  test("can delete with valid id", async () => {
    const testUser = await createUser()
    const response = await request(app)
      .delete(`/users/${testUser.id}`)
      .auth(createToken(loginUser.email), { type: "bearer" })

    expect(response.status).toBe(200)
  })
  test("cant delete with invalid id", async () => {
    const response = await request(app)
      .delete(`/users/0`)
      .auth(createToken(loginUser.email), { type: "bearer" })

    expect(response.status).toBe(404)
  })
})

// t.teardown(async () => {
//   await db.destroy()
// })
