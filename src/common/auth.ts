import { Request, Response, NextFunction } from "express"
import { db } from "@/common/database/index.js"
import env from "@/config/env.js"
import jwt from "jsonwebtoken"

export async function isAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.header("Authorization")
    if (!authHeader) {
      return res.status(401).json({ message: "Unauthorized" })
    }

    const tokenArray = authHeader.split(" ")
    if (tokenArray.length !== 2 || tokenArray[0] !== "Bearer") {
      return res
        .status(401)
        .json({ message: "Invalid Authorization header format" })
    }

    const token = tokenArray[1]
    if (!token) {
      return res
        .status(401)
        .json({ message: "Invalid Authorization header format" })
    }

    jwt.verify(token, env.APP_KEY, async (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: "Invalid token" })
      }

      const payload = decoded as { email: string }

      const user = await db
        .selectFrom("users")
        .where("email", "=", payload.email)
        .selectAll()
        .executeTakeFirst()

      if (!user) {
        return res.status(403).json({ message: "Invalid token" })
      }
      req.user = {
        id: user.id,
        email: user.email,
      }
      return next()
    })
  } catch (error) {
    return next(error)
  }
}

export function createToken(email: string) {
  return jwt.sign({ email: email }, env.APP_KEY, {
    expiresIn: "24h",
  })
}
