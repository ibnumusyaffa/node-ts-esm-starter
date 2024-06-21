import request from "supertest"
import app from "@/app.js"
import { faker } from "@faker-js/faker"
import { createToken } from "@/common/auth.js"
import { createUser } from "./seeders/user.js"
import { expect, test, describe } from "vitest"
/* eslint-disable unicorn/prefer-ternary */
import { pool } from "@/common/database/index.js"
const poolPromise = pool.promise()

expect.extend({
  async toHaveRowInTable(data: Record<string, any>, tableName: string) {
    const { isNot } = this
    let query = `SELECT COUNT(*) AS count FROM \`${tableName}\` WHERE `
    const conditions = Object.keys(data)
      .map((key) => `\`${key}\` = ?`)
      .join(" AND ")
    query += conditions + ";"

    const values = Object.values(data)

    try {
      const [rows] = await poolPromise.query(query, values)

      const hasRow = rows[0].count > 0

      return {
        message: () =>
          `expected table ${tableName} ${isNot ? "not" : ""} to have row matching ${JSON.stringify(
            data
          )}`,
        pass: hasRow,
      }
    } catch (error: any) {
      return {
        message: () => `${error?.message}`,
        pass: false,
      }
    }
  },
})

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
