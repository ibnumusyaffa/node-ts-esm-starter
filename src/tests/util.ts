import jwt from "jsonwebtoken"

export function createToken(email: string) {
  const JWT_SECRET = process.env.JWT_SECRET || ""
  const token = jwt.sign({ email }, JWT_SECRET, {
    expiresIn: "24h",
  })

  return token
}
