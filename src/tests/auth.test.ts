import t from "tap"
import request from "supertest"
import app from "@/app.js"
import { connection } from "@/common/database/index.js"
import { createUser } from "./seeders/user.js"

t.test("can login with valid data", async (t) => {
  // create user
  const user = await createUser()

  // login
  const respLogin = await request(app).post("/auth/login").send({
    email: user.email,
    password: user.password,
  })
  
  // assert login response
  t.hasOwnPropsOnly(respLogin.body, ["message", "token"])

  // profile
  const respProfile = await request(app)
    .post("/auth/profile")
    .send({
      email: user.email,
      password: user.password,
    })
    .auth(respLogin.body.token, { type: "bearer" })
  // assert profile response
  t.equal(user.name, respProfile.body.name)
  t.equal(user.email, respProfile.body.email)
})

t.test("cant login with invalid data", async (t) => {
  const response = await request(app).post("/auth/login").send({
    email: "invalid@example.com",
    password: "Password123*",
  })

  const body = response.body

  t.hasOwnProp(body, "message")
  t.equal(401, response.status)
})

t.teardown(() => {
  connection.end()
})
