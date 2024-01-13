import { connection } from "@/shared/rabbit-mq.js"

export type Message = { name: string; link: string; email: string }

export async function forgotPassword(data: Message) {
  const channel = await connection.createChannel()
  await channel.assertQueue("forgot-password", { durable: true })
  const message = JSON.stringify(data)
  channel.sendToQueue("forgot-password", Buffer.from(message), {
    persistent: true,
  })
}
