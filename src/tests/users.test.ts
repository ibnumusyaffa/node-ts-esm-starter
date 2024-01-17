import t from "tap"
import request from "supertest"
import app from "@/app.js"
import { connection } from "@/shared/db/index.js"
import { faker } from "@faker-js/faker"
import { createToken } from "./util.js"

t.test("create user", async (t) => {
  t.test("can create with valid data", async (t) => {
    const newUser = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password({ length: 8 }),
    }
    const response = await request(app)
      .post("/users")
      .auth(createToken("Kameron.Jacobson87@hotmail.com"), { type: "bearer" })
      .send(newUser)

    t.type(response.body.message, "string")
  })
  t.test("cant create with invalid data", async (t) => {
    const newUser = {}
    const response = await request(app)
      .post("/users")
      .auth(createToken("Kameron.Jacobson87@hotmail.com"), { type: "bearer" })
      .send(newUser)
    t.equal(422, response.status)
  })
})

t.test("list users", async (t) => {
  const response = await request(app)
    .get("/users")
    .auth(createToken("Kameron.Jacobson87@hotmail.com"), { type: "bearer" })
  t.type(response.body, "array")
})

t.test("detail user", async (t) => {
  const listResponse = await request(app)
    .get("/users")
    .auth(createToken("Kameron.Jacobson87@hotmail.com"), { type: "bearer" })
  const id = listResponse.body[0].id
  const detailResponse = await request(app)
    .get(`/users/${id}`)
    .auth(createToken("Kameron.Jacobson87@hotmail.com"), { type: "bearer" })
  t.equal(200, detailResponse.status)
})

t.teardown(() => {
  connection.end()
})
