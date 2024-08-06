import request from "supertest"
import app from "@/app.js"
import { createUser } from "./seeders/user.js"
import { expect, test, describe, beforeAll, afterAll } from "vitest"

beforeAll(() => {})

describe("auth", () => {
  test("can login with valid data", async (t) => {
    // arrange
    const user = await createUser()

    // act
    const loginResponse = await request(app).post("/auth/login").send({
      email: user.email,
      password: user.password,
    })

    // assert
    expect(loginResponse.body).toHaveProperty("token")
    // profile
    const profileResponse = await request(app)
      .get("/auth/profile")
      .auth(loginResponse.body.token, { type: "bearer" })
    // assert profile response
    expect(user.name).toBe(profileResponse.body.name)
    expect(user.email).toBe(profileResponse.body.email)
  })

  test("cant login with invalid data", async (t) => {
    const response = await request(app).post("/auth/login").send({
      email: "invalid@example.com",
      password: "Password123*",
    })

    const body = response.body

    expect(body).toHaveProperty("message")
    expect(response.status).toBe(401)
  })
})

afterAll(() => {})
