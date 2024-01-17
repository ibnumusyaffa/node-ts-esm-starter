import t from "tap"
import request from "supertest"
import app from "@/app.js"
import { connection } from "@/shared/db/index.js"
import { faker } from "@faker-js/faker"

t.test("list users", async (t) => {
  const response = await request(app).get("/users")
  t.type(response.body, "array")
})

t.test("create user", async (t) => {
  const newUser = {
    name: faker.person.fullName(),
    email: faker.internet.email(),
    password: faker.internet.password({ length: 8 }),
  }
  const response = await request(app).post("/users").send(newUser)
  t.type(response.body.message, "string")
})

t.test("detail user", async (t) => {
  const listResponse = await request(app).get("/users")
  const id = listResponse.body[0].id
  const detailResponse = await request(app).get(`/users/${id}`)
  console.log(detailResponse.body)
})

t.teardown(() => {
  connection.end()
})
