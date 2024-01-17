import express from "express"
import * as auth from "@/features/auth/auth.controller.js"
import { isAuthenticated } from "@/shared/auth.js"

const router = express.Router()
router.post("/login", auth.login)
router.post("/profile", isAuthenticated, auth.profile)

export default router
