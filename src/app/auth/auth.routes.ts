import express from "express"
import * as auth from "@/app/auth/auth.controller.js"
import { isAuthenticated } from "@/common/auth.js"

const router = express.Router()
router.post("/login", auth.login)
router.get("/profile", isAuthenticated, auth.profile)

router.post("/forgot-password", auth.forgotPassword)
router.post("/reset-password", auth.resetPassword)

export default router
