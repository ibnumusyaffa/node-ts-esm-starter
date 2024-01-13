import t from "tap"
import request from "supertest"
import app from "@/app.js"

t.test("this is a child test 1", async (t) => {
  const response = await request(app).get("/")
  t.equal("It workss", response.body.message)
})

