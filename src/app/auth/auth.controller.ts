import { Request, Response, NextFunction } from "express"
import { db } from "@/common/database/index.js"
import bcrypt from "bcrypt"
import { createToken } from "@/common/auth.js"

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body

    const user = await db
      .selectFrom("users")
      .where("email", "=", email)
      .selectAll()
      .executeTakeFirst()

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" })
    }

    const passwordMatch = await bcrypt.compare(password, user.password)
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid email or password" })
    }
    const token = createToken(user.email)
    return res.json({ message: "User registered successfully", token })
  } catch (error) {
    return next(error)
  }
}

export async function profile(req: Request, res: Response, next: NextFunction) {
  try {
    const email = req.user?.email

    if (!email) {
      return res.status(401).json({ message: "invalid" })
    }

    const user = await db
      .selectFrom("users")
      .where("email", "=", email)
      .selectAll()
      .executeTakeFirst()

    return res.json(user)
  } catch (error) {
    return next(error)
  }
}

export async function forgotPassword(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const email = req.user?.email

    if (!email) {
      return res.status(401).json({ message: "invalid" })
    }

    const user = await db
      .selectFrom("users")
      .where("email", "=", email)
      .selectAll()
      .executeTakeFirst()

    return res.json(user)
  } catch (error) {
    return next(error)
  }
}
