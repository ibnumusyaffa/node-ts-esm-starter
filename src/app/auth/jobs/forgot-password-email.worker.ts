import "dotenv/config"
import { logger } from "@/common/logger.js"
import { connection } from "@/common/rabbit-mq.js"
import { Message } from "./users.queue.js"
import { transporter } from "@/common/node-mailer.js"
import { ForgotPasswordEmail } from "@/app/auth/email/forgot-password.js"
import { render } from "jsx-email"
import { handleError } from "@/common/error.js"

const channel = await connection.createChannel()
const queueName = "forgot-password"
await channel.assertQueue(queueName, { durable: true })

channel.consume(
  queueName,
  async (msg) => {
    try {
      if (msg === null) {
        return
      }
      logger.info("start forgot-password")
      const data: Message = JSON.parse(msg.content.toString())
      logger.info(data.email)
      const html = await render(ForgotPasswordEmail(data))
      await transporter.sendMail({
        to: data.email,
        subject: "Forgot Password",
        html: html,
      })
      logger.info("end forgot-password")
      channel.ack(msg)
    } catch (error) {
      handleError(error)
    }
  },
  { noAck: false }
)

logger.info("send email worker started")
