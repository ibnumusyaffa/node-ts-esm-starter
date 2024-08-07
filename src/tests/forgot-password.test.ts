import request from "supertest"
import app from "@/app.js"
import { createUser } from "./seeders/user.js"
import { expect, test, describe, vi, afterAll } from "vitest"
import * as queue from "@/app/auth/jobs/users.queue.js"
import { db } from "@/common/database/index.js"

vi.spyOn(queue, "sendforgotPasswordEmail").mockImplementation(async () => {
  console.log("mocked")
})

const loginUser = await createUser()
describe("forgot-password", () => {
  test("forgot password test", async (t) => {
    //request forgot password email
    const forgotPasswordResponse = await request(app)
      .post("/auth/forgot-password")
      .send({
        email: loginUser.email,
      })

    //get the token
    const token = forgotPasswordResponse.body.token
    expect(200).toBe(forgotPasswordResponse.status)

    //reset password with token
    const newPassword = "Something123*"
    const resetPasswordResponse = await request(app)
      .post("/auth/reset-password")
      .send({
        email: loginUser.email,
        token: token,
        password: newPassword,
        password_confirmation: newPassword,
      })

    expect(resetPasswordResponse.status).toBe(200)

    //check new password with login
    const respLogin = await request(app).post("/auth/login").send({
      email: loginUser.email,
      password: newPassword,
    })

    expect(respLogin.status).toBe(200)
    // assert login response
    expect(respLogin.body).toHaveProperty(["token"])

    // profile
    const respProfile = await request(app)
      .get("/auth/profile")
      .auth(respLogin.body.token, { type: "bearer" })
    // assert profile response
    expect(loginUser.name).toBe(respProfile.body.name)
    expect(loginUser.email).toBe(respProfile.body.email)
  })
})

afterAll(async () => {
  await db.destroy()
})
