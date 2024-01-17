import { Request, Response, NextFunction } from "express"
import { users } from "@/shared/db/schema.js"
import { eq, and } from "drizzle-orm"
import { db } from "@/shared/db/index.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body
    const user = await db.query.users.findFirst({
      where: and(eq(users.email, email)),
    })

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" })
    }

    const passwordMatch = await bcrypt.compare(password, user.password)
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid email or password" })
    }

    const token = jwt.sign({ email }, process.env.JWT_SECRET as string, {
      expiresIn: "24h",
    })
    return res.json({ message: "User registered successfully", token })
  } catch (error) {
    return next(error)
  }
}
