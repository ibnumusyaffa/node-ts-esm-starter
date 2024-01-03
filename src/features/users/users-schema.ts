import { body } from "express-validator"

export const createUser = [
  body("email")
    .isEmail()
    .withMessage("Email is not valid")
    .notEmpty()
    .withMessage("required"),
  body("password").isLength({ min: 6 }),
]
