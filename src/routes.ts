import express from "express"
import users from "@/features/users/users.router.js"
import auth from "@/features/auth/auth.router.js"
const router = express.Router()
router.get("/", (req, res) => {
  return res.send({ message: "It works" })
})
router.use("/users", users)
router.use("/auth", auth)

export default router
