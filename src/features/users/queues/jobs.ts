import { connection } from "@/shared/rabbit-mq.js"

export async function sendEmail(message: string) {
  const channel = await connection.createChannel()
  await channel.assertQueue("send-email", { durable: true })

  channel.sendToQueue("send-email", Buffer.from(message), {
    persistent: true,
  })
}
