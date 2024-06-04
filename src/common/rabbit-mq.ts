import amqp from "amqplib"
import env from "@/config/env.js"

let connection: amqp.Connection | undefined = undefined
export async function connect() {
  if (connection) {
    return connection
  }
  connection = await amqp.connect({
    protocol: "amqp",
    hostname: env.RABBITMQ_HOST,
    port: env.RABBITMQ_PORT,
    username: env.RABBITMQ_USERNAME,
    password: env.RABBITMQ_PASSWORD,
  })
  return connection
}
