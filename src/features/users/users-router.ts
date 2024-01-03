import express from "express"
import { validate } from "@/shared/middleware/validate.js"
import * as user from "@/features/users/users-controller.js"
import * as schema from "@/features/users/users-schema.js"

const router = express.Router()

router.get("/", user.list)
router.post("/", validate(schema.createUser), user.create)

export default router
