import { body } from "express-validator"

export const createUser = [
  body("name").notEmpty().withMessage("required"),
  body("email")
    .isEmail()
    .withMessage("Email is not valid")
    .notEmpty()
    .withMessage("required"),
  body("password").notEmpty().withMessage("required").isLength({ min: 6 }),
]
