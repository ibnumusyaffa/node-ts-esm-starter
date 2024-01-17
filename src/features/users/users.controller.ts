import { Request, Response, NextFunction } from "express"
import { users } from "@/shared/db/schema.js"
import { db } from "@/shared/db/index.js"
import bcrypt from "bcrypt"
import { eq } from "drizzle-orm"

export async function list(req: Request, res: Response, next: NextFunction) {
  try {
    const users = await db.query.users.findMany()
    return res.json(users)
  } catch (error) {
    return next(error)
  }
}

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const body = req.body as {
      name: string
      email: string
      password: string
    }

    body.password = await bcrypt.hash(body.password, 10)

    await db.insert(users).values(body)

    return res.send({ message: "Successfully create data" })
  } catch (error) {
    return next(error)
  }
}

export async function detail(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = parseInt(req.params.id)
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
    })
    return res.send(user)
  } catch (error) {
    return next(error)
  }
}
