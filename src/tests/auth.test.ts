import t from "tap"
import request from "supertest"
import app from "@/app.js"
import { connection } from "@/shared/db/index.js"
import { faker } from "@faker-js/faker"
import { createToken } from "./util.js"

t.test("can login with valid data", async (t) => {
  const user = {
    name: faker.person.fullName(),
    email: faker.internet.email(),
    password: faker.internet.password({ length: 8 }),
  }
  await request(app)
    .post("/users")
    .auth(createToken("Kameron.Jacobson87@hotmail.com"), { type: "bearer" })
    .send(user)

  const response = await request(app).post("/auth/login").send({
    email: user.email,
    password: user.password,
  })

  const body = response.body

  t.hasOwnProp(body, "message")
  t.hasOwnProp(body, "token")
  t.equal(200, response.status)

  const responseProfile = await request(app)
    .post("/auth/profile")
    .send({
      email: user.email,
      password: user.password,
    })
    .auth(body.token, { type: "bearer" })

  t.equal(200, responseProfile.status)
  t.equal(user.name, responseProfile.body.name)
  t.equal(user.email, responseProfile.body.email)
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
