import { connection } from "@/common/rabbit-mq.js"

export type Message = { name: string; link: string; email: string }

export async function forgotPasswordEmail(data: Message) {
  const channel = await connection.createChannel()
  const queueName = "forgot-password"
  await channel.assertQueue(queueName, { durable: true })

  const message = JSON.stringify(data)
  channel.sendToQueue(queueName, Buffer.from(message), {
    persistent: true,
  })
}
