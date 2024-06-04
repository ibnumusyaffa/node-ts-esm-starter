import t from "tap"
import request from "supertest"
import app from "@/app.js"
import { db } from "@/common/database/index.js"
import { faker } from "@faker-js/faker"
import { createToken } from "@/common/auth.js"
import { createUser } from "./seeders/user.js"

const loginUser = await createUser()

t.test("create user", async (t) => {
  t.test("can create with valid data", async (t) => {
    const response = await request(app)
      .post("/users")
      .auth(createToken(loginUser.email), { type: "bearer" })
      .send({
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: faker.internet.password({ length: 8 }),
      })

    t.equal(201, response.status)
  })
  t.test("cant create with invalid data", async (t) => {
    const response = await request(app)
      .post("/users")
      .auth(createToken(loginUser.email), { type: "bearer" })
      .send({
        email: "",
      })
    t.equal(422, response.status)
  })
})

t.test("list users", async (t) => {
  const response = await request(app)
    .get("/users")
    .auth(createToken(loginUser.email), { type: "bearer" })
  t.type(response.body.data, "array")
})

t.test("detail user", async (t) => {
  const detailResponse = await request(app)
    .get(`/users/${loginUser.id}`)
    .auth(createToken(loginUser.email), { type: "bearer" })

  t.equal(200, detailResponse.status)
  t.equal(loginUser.email, detailResponse.body.email)
  t.equal(loginUser.name, detailResponse.body.name)
})

t.test("delete user", async (t) => {
  t.test("can delete with valid id", async (t) => {
    const testUser = await createUser()
    const response = await request(app)
      .delete(`/users/${testUser.id}`)
      .auth(createToken(loginUser.email), { type: "bearer" })

    t.equal(200, response.status)
  })
  t.test("cant delete with invalid id", async (t) => {
    const response = await request(app)
      .delete(`/users/0`)
      .auth(createToken(loginUser.email), { type: "bearer" })

    t.equal(404, response.status)
  })
})

t.teardown(async () => {
  await db.destroy()
})
