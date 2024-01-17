import express from "express"
import { validate } from "@/shared/middleware/validate.js"
import * as auth from "@/features/auth/auth.controller.js"

const router = express.Router()
router.post("/login", auth.login)

export default router
