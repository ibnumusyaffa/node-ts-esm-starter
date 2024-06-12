import { Request, Response, NextFunction } from "express"

import { db } from "@/common/database/index.js"
import bcrypt from "bcrypt"

type ListParams = {
  page?: string
  limit?: string
  keyword?: string
}

export async function list(
  req: Request<any, any, any, ListParams>,
  res: Response,
  next: NextFunction
) {
  try {
    const page = req.query.page ? Number(req.query.page) : 1
    const limit = req.query.limit ? Number(req.query.limit) : 10
    const offset = (page - 1) * limit

    const keyword = req.query.keyword
    let query = db.selectFrom("users")

    if (keyword) {
      query = query.where("name", "like", `%${keyword}%`)
    }

    const users = await query
      .selectAll()
      .orderBy("id")
      .limit(limit)
      .offset(offset)
      .execute()

    const count = await query
      .select((eb) => eb.fn.countAll().as("total"))
      .executeTakeFirst()

    const meta = {
      total: count?.total,
      totalPages: Math.ceil(Number(count?.total) / limit),
      page,
      limit,
    }
    return res.send({
      meta,
      data: users,
    })
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
  req: Request<any, any, CreateBody>,
  res: Response,
  next: NextFunction
) {
  try {
    const body = req.body
    await db
      .insertInto("users")
      .values({
        name: body.name,
        email: body.email,
        password: await bcrypt.hash(body.password, 10),
      })
      .execute()

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
  req: Request<{ id: string }, any, UpdateBody>,
  res: Response,
  next: NextFunction
) {
  try {
    const body = req.body
    const userId = Number.parseInt(req.params.id)

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

    return res.json({ message: "Successfully update data" })
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
    const userId = Number.parseInt(req.params.id)
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
    const userId = Number.parseInt(req.params.id)
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
