import request from "supertest"
import app from "@/app.js"
import { createUser } from "./seeders/user.js"
import { expect, test, describe, beforeAll, afterAll } from "vitest"

beforeAll(() => {
  console.log("before all")
})

describe("auth", () => {
  test("can login with valid data", async (t) => {
    // create user
    const user = await createUser()

    // login
    const respLogin = await request(app).post("/auth/login").send({
      email: user.email,
      password: user.password,
    })

    // assert login response

    expect(respLogin.body).toHaveProperty("token")
    // profile
    const respProfile = await request(app)
      .get("/auth/profile")
      .auth(respLogin.body.token, { type: "bearer" })
    // assert profile response
    expect(user.name).toBe(respProfile.body.name)
    expect(user.email).toBe(respProfile.body.email)
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

afterAll(() => {
  console.log("after all")
})

// t.teardown(async () => {
//   await db.destroy()
// })
