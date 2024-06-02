import { Request, Response, NextFunction } from "express"

import { db } from "@/common/database/index.js"
import bcrypt from "bcrypt"

export async function list(req: Request, res: Response, next: NextFunction) {
  try {
    const users = await db.selectFrom("user").selectAll().execute()
    return res.json(users)
  } catch (error) {
    return next(error)
  }
}

type CreateReqBody = {
  name: string
  email: string
  password: string
}

export async function create(
  req: Request<{}, {}, CreateReqBody>,
  res: Response,
  next: NextFunction
) {
  try {
    const body = req.body
    db.insertInto("user").values({
      name: body.name,
      email: body.email,
      password: await bcrypt.hash(body.password, 10),
    })

    return res.status(201).send({ message: "Successfully create data" })
  } catch (error) {
    return next(error)
  }
}

type UpdateReqBody = {
  name: string
  email: string
  password: string
}

export async function update(
  req: Request<{ id: string }, {}, UpdateReqBody>,
  res: Response,
  next: NextFunction
) {
  try {
    const body = req.body
    const userId = parseInt(req.params.id)

    const user = await db
      .selectFrom("user")
      .where("id", "=", userId)
      .selectAll()
      .executeTakeFirst()

    if (!user) {
      return res.status(404).send({
        message: "not found",
      })
    }

    await db
      .updateTable("user")
      .set({ name: body.name, email: body.email })
      .where("id", "=", userId)
      .executeTakeFirst()

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
    const user = await db
      .selectFrom("user")
      .where("id", "=", userId)
      .selectAll()
      .executeTakeFirst()

    if (!user) {
      return res.status(404).send({
        message: "not found",
      })
    }
    return res.send(user)
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
      .selectFrom("user")
      .where("id", "=", userId)
      .selectAll()
      .executeTakeFirst()

    if (!user) {
      return res.status(404).send({
        message: "not found",
      })
    }

    await db.deleteFrom("user").where("id", "=", userId).execute()

    return res.send({ message: "Successfully delete data" })
  } catch (error) {
    return next(error)
  }
}
