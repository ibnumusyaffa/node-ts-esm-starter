import express from "express"
import { validate } from "@/common/middleware/validate.js"
import * as user from "@/app/users/users.controller.js"
import * as schema from "@/app/users/users.schema.js"
import { isAuthenticated } from "@/libs/auth.js"

const router = express.Router()

router.use(isAuthenticated)
router.get("/", user.list)
router.post("/", validate(schema.createUser), user.create)
router.get("/:id", user.detail)
router.delete("/:id", user.destroy)

export default router
