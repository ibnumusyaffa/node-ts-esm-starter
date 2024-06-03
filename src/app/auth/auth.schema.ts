import { body } from "express-validator"

export const login = [
  body("email")
    .isEmail()
    .withMessage("Email is not valid")
    .notEmpty()
    .withMessage("required"),
  body("password").notEmpty().withMessage("required").isLength({ min: 6 }),
]

export const forgotPassword = [
  body("email")
    .isEmail()
    .withMessage("Email is not valid")
    .notEmpty()
    .withMessage("required"),
]

export const resetPassword = [
  body("token").notEmpty().withMessage("required"),
  body("email")
    .isEmail()
    .withMessage("Email is not valid")
    .notEmpty()
    .withMessage("required"),
  body("password").notEmpty().withMessage("required"),
  body("password_confirmation")
    .notEmpty()
    .withMessage("required")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        return false
      }
      return true
    })
    .withMessage("Not match"),
]
