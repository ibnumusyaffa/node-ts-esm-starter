import nodemailer from "nodemailer"
import env from "@/config/env.js"

export const transporter = nodemailer.createTransport({
  pool: true,
  host: env.MAIL_HOST,
  port: env.MAIL_PORT,
  secure: true,
  from: `${env.MAIL_FROM_NAME} ${env.MAIL_FROM_ADDRESS}`,
  auth: {
    user: env.MAIL_USERNAME,
    pass: env.MAIL_PASSWORD,
  },
})
