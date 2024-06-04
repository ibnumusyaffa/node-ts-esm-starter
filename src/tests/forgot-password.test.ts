import t from "tap"
import request from "supertest"
import app from "@/app.js"
import { db } from "@/common/database/index.js"
import { connect } from "@/common/rabbit-mq.js"
import { createUser } from "./seeders/user.js"

const loginUser = await createUser()

t.test("forgot password test", async (t) => {
  //request forgot password email
  const forgotPasswordResponse = await request(app)
    .post("/auth/forgot-password")
    .send({
      email: loginUser.email,
    })

  //get the token
  const token = forgotPasswordResponse.body.token
  t.equal(200, forgotPasswordResponse.status)

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

  t.equal(200, resetPasswordResponse.status)

  //check new password with login
  const respLogin = await request(app).post("/auth/login").send({
    email: loginUser.email,
    password: newPassword,
  })
  t.equal(200, respLogin.status)

  // assert login response
  t.hasOwnPropsOnly(respLogin.body, ["token"])

  // profile
  const respProfile = await request(app)
    .get("/auth/profile")
    .auth(respLogin.body.token, { type: "bearer" })
  // assert profile response
  t.equal(loginUser.name, respProfile.body.name)
  t.equal(loginUser.email, respProfile.body.email)
})

t.teardown(async () => {
  await db.destroy()
  const connection = await connect()
  await connection.close()
})
