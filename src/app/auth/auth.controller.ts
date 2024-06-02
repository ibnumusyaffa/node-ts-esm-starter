import { Request, Response, NextFunction } from "express"
import { db } from "@/common/database/index.js"
import bcrypt from "bcrypt"
import env from "@/config/env.js"
import jwt from "jsonwebtoken"

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body

    const user = await db
      .selectFrom("user")
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
    const token = jwt.sign({ email: user.email }, env.APP_KEY, {
      expiresIn: "24h",
    })
    return res.json({ message: "User registered successfully", token })
  } catch (error) {
    return next(error)
  }
}

export async function profile(req: Request, res: Response, next: NextFunction) {
  try {
    const email = req.user?.email

    if (!email) {
      return res.status(401).send({ message: "invalid" })
    }

    const user = await db
      .selectFrom("user")
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
      return res.status(401).send({ message: "invalid" })
    }

    const user = await db
      .selectFrom("user")
      .where("email", "=", email)
      .selectAll()
      .executeTakeFirst()

    return res.json(user)
  } catch (error) {
    return next(error)
  }
}
