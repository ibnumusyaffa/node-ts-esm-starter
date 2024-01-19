import amqp from "amqplib"
import env from "@/shared/env.js"

async function connect() {
  try {
    const connection = await amqp.connect({
      protocol: "amqp",
      hostname: env.RABBITMQ_HOST,
      port: env.RABBITMQ_PORT,
      username: env.RABBITMQ_USERNAME,
      password: env.RABBITMQ_PASSWORD,
    })
    return connection
  } catch (error) {
    if (error instanceof Error) {
      console.log("Failed connect to RabbitMQ: ", error.message)
    }
    throw error
  }
}

export const connection = await connect()
