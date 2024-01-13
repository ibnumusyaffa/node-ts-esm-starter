import express from "express"
import users from "@/features/users/users.router.js"

const router = express.Router()
router.get("/", (req, res) => {
  return res.send({ message: "It works" })
})
router.use("/users", users)

export default router
