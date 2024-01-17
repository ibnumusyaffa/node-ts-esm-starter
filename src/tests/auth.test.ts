import t from "tap"
import request from "supertest"
import app from "@/app.js"
import { connection } from "@/shared/db/index.js"
import { faker } from "@faker-js/faker"



t.test("login", async (t) => {
  const user = {
    name: faker.person.fullName(),
    email: faker.internet.email(),
    password: faker.internet.password({ length: 8 }),
  }
  await request(app).post("/users").send(user)

  const response = await request(app).post("/auth/login").send({
    email: user.email,
    password: user.password,
  })
  console.log(response.body)
})

t.teardown(() => {
  connection.end()
})
