import amqp from "amqplib"

export const connection = await amqp.connect({
  protocol: "amqp",
  hostname: process.env.RABBITMQ_HOST || "localhost",
  port: process.env.RABBITMQ_PORT
    ? parseInt(process.env.RABBITMQ_PORT, 10)
    : 5672,
  username: process.env.RABBITMQ_USERNAME || "guest",
  password: process.env.RABBITMQ_PASSWORD || "guest",
})
