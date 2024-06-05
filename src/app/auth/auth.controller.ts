import { Request, Response, NextFunction } from "express"
import { db } from "@/common/database/index.js"
import bcrypt from "bcrypt"
import { createToken } from "@/common/auth.js"
import { randomUUID } from "crypto"
import env from "@/config/env.js"
import { sendforgotPasswordEmail } from "./jobs/users.queue.js"

type LoginBody = {
  email: string
  password: string
}

export async function login(
  req: Request<{}, {}, LoginBody>,
  res: Response,
  next: NextFunction
) {
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
    return res.json({ token })
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

type ForgotPasswordBody = {
  email: string
}

export async function forgotPassword(
  req: Request<{}, {}, ForgotPasswordBody>,
  res: Response,
  next: NextFunction
) {
  try {
    const email = req.body.email

    const user = await db
      .selectFrom("users")
      .where("email", "=", email)
      .selectAll()
      .executeTakeFirst()

    if (!user) {
      return res.json({
        message: "We'll send a reset email if the account exists",
      })
    }

    await db.deleteFrom("password_resets").where("email", "=", email).execute()

    const token = randomUUID()
    await db
      .insertInto("password_resets")
      .values({
        email: user.email,
        token: await bcrypt.hash(token, 10),
      })
      .execute()

    sendforgotPasswordEmail({
      name: user.name,
      email: user.email,
      link: `${env.FRONTEND_URL}/reset-password/${token}?email=${user.email}`,
    })

    return res.json({
      token: env.NODE_ENV === "test" ? token : undefined,
      message: "We'll send a reset email if the account exists",
    })
  } catch (error) {
    return next(error)
  }
}

type ResetPasswordBody = {
  email: string
  token: string
  password: string
}
export async function resetPassword(
  req: Request<{}, {}, ResetPasswordBody>,
  res: Response,
  next: NextFunction
) {
  try {
    const { token, email, password } = req.body

    //check token & email validity
    const reset = await db
      .selectFrom("password_resets")
      .where("email", "=", email)
      .selectAll()
      .executeTakeFirst()

    if (!reset) {
      return res.status(401).json({ message: "Reset not found" })
    }

    const passwordMatch = await bcrypt.compare(token, reset.token)
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid token" })
    }

    //check expired from created_at
    const curTime = new Date().getTime()
    const diffInMinutes = (curTime - reset.created_at.getTime()) / (1000 * 60)
    const isExpired = diffInMinutes > 60

    if (!isExpired) {
      await db
        .deleteFrom("password_resets")
        .where("email", "=", email)
        .execute()
      return res.status(401).json({ message: "Expired token" })
    }

    await db
      .updateTable("users")
      .set({ password: await bcrypt.hash(password, 10) })
      .where("email", "=", email)
      .executeTakeFirst()

    //delete token
    await db.deleteFrom("password_resets").where("email", "=", email).execute()

    return res.json({ message: "Successfully updated the password" })
  } catch (error) {
    return next(error)
  }
}
