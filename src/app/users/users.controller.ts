import { Request, Response, NextFunction } from "express"

import { db } from "@/common/database/index.js"
import bcrypt from "bcrypt"

export async function list(req: Request, res: Response, next: NextFunction) {
  try {
    const users = await db.selectFrom("users").selectAll().execute()
    return res.json(users)
  } catch (error) {
    return next(error)
  }
}

type CreateBody = {
  name: string
  email: string
  password: string
}

export async function create(
  req: Request<{}, {}, CreateBody>,
  res: Response,
  next: NextFunction
) {
  try {
    const body = req.body
    db.insertInto("users").values({
      name: body.name,
      email: body.email,
      password: await bcrypt.hash(body.password, 10),
    })

    return res.status(201).json({ message: "Successfully create data" })
  } catch (error) {
    return next(error)
  }
}

type UpdateBody = {
  name: string
  email: string
  password: string
}

export async function update(
  req: Request<{ id: string }, {}, UpdateBody>,
  res: Response,
  next: NextFunction
) {
  try {
    const body = req.body
    const userId = parseInt(req.params.id)

    const user = await db
      .selectFrom("users")
      .where("id", "=", userId)
      .selectAll()
      .executeTakeFirst()

    if (!user) {
      return res.status(404).json({
        message: "not found",
      })
    }

    await db
      .updateTable("users")
      .set({ name: body.name, email: body.email })
      .where("id", "=", userId)
      .executeTakeFirst()

    return res.json({ message: "Successfully create data" })
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
    const user = await db
      .selectFrom("users")
      .where("id", "=", userId)
      .selectAll()
      .executeTakeFirst()

    if (!user) {
      return res.status(404).json({
        message: "not found",
      })
    }
    return res.json(user)
  } catch (error) {
    return next(error)
  }
}

export async function destroy(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = parseInt(req.params.id)
    const user = await db
      .selectFrom("users")
      .where("id", "=", userId)
      .selectAll()
      .executeTakeFirst()

    if (!user) {
      return res.status(404).json({
        message: "not found",
      })
    }

    await db.deleteFrom("users").where("id", "=", userId).execute()

    return res.json({ message: "Successfully delete data" })
  } catch (error) {
    return next(error)
  }
}
