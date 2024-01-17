import express from "express"
import { validate } from "@/shared/middleware/validate.js"
import * as user from "@/features/users/users.controller.js"
import * as schema from "@/features/users/users.schema.js"
import { isAuthenticated } from "@/shared/auth.js"

const router = express.Router()

router.use(isAuthenticated)
router.get("/", user.list)
router.post("/", validate(schema.createUser), user.create)
router.get("/:id", user.detail)

export default router
