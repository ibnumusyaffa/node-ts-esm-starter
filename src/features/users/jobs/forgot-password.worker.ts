import "dotenv/config"
import { logger } from "@/shared/logger.js"
import { connection } from "@/shared/rabbit-mq.js"
import { Message } from "./users.queue.js"
import { transporter } from "@/shared/node-mailer.js"
import { ForgotPasswordEmail } from "@/features/users/email/forgot-password.js"
import { render } from "jsx-email"

const channel = await connection.createChannel()
await channel.assertQueue("forgot-password", { durable: true })
channel.consume(
  "forgot-password",
  async (msg) => {
    if (msg !== null) {
      const data: Message = JSON.parse(msg.content.toString())
      const html = await render(ForgotPasswordEmail(data))
      await transporter.sendMail({
        from: "penguin@joker.us",
        to: data.email,
        subject: "Forgot Password",
        html: html,
      })
      logger.info("sent")
      channel.ack(msg)
    }
  },
  { noAck: false }
)

logger.info("send email worker started")
