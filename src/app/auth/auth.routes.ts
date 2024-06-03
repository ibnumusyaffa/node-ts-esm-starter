import express from "express"
import * as auth from "@/app/auth/auth.controller.js"
import { isAuthenticated } from "@/common/auth.js"
import { validate } from "@/common/validator.js"
import * as schema from "@/app/auth/auth.schema.js"

const router = express.Router()

router.post("/login", auth.login)
router.get("/profile", isAuthenticated, auth.profile)

router.post(
  "/forgot-password",
  validate(schema.forgotPassword),
  auth.forgotPassword
)
router.post(
  "/reset-password",
  validate(schema.resetPassword),
  auth.resetPassword
)

export default router
