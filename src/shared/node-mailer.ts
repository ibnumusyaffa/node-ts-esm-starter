import nodemailer from "nodemailer"
import env from "@/shared/env.js"
export const transporter = nodemailer.createTransport({
  pool: true,
  host: env.MAIL_HOST,
  port: env.MAIL_PORT,
  secure: false,
  from: {
    name: env.MAIL_FROM_NAME,
    address: env.MAIL_FROM_ADDRESS,
  },
  auth: {
    user: env.MAIL_USERNAME,
    pass: env.MAIL_PASSWORD,
  },
})
