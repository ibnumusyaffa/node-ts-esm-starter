import "dotenv/config"
import { logger } from "@/common/logger.js"
import { connection } from "@/common/rabbit-mq.js"
import { Message } from "./users.queue.js"
import { transporter } from "@/common/node-mailer.js"
import { ForgotPasswordEmail } from "@/app/auth/email/forgot-password.js"
import { render } from "jsx-email"
import { handleError } from "@/common/error.js"

const channel = await connection.createChannel()
await channel.assertQueue("forgot-password", { durable: true })

channel.consume(
  "forgot-password",
  async (msg) => {
    try {
      if (msg === null) {
        return
      }

      const data: Message = JSON.parse(msg.content.toString())
      const html = await render(ForgotPasswordEmail(data))
      await transporter.sendMail({
        to: data.email,
        subject: "Forgot Password",
        html: html,
      })
      logger.info("sent")
      channel.ack(msg)
    } catch (error) {
      if (error instanceof Error) {
        handleError(error)
      }
    }
  },
  { noAck: false }
)

logger.info("send email worker started")
