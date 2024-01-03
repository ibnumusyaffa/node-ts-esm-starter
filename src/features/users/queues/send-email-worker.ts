import { connection } from "@/shared/rabbit-mq.js"

async function sendEmailWorker() {
  const channel = await connection.createChannel()
  await channel.assertQueue("email", { durable: true })
  channel.consume(
    "email",
    async (msg) => {
      if (msg !== null) {
        const messageContent = msg.content.toString()
        console.log(messageContent)
        channel.ack(msg)
      }
    },
    { noAck: false }
  )
}

await sendEmailWorker()
