import amqp from "amqplib"

async function connect() {
  try {
    const connection = await amqp.connect({
      protocol: "amqp",
      hostname: process.env.RABBITMQ_HOST || "localhost",
      port: process.env.RABBITMQ_PORT
        ? parseInt(process.env.RABBITMQ_PORT, 10)
        : 5672,
      username: process.env.RABBITMQ_USERNAME || "guest",
      password: process.env.RABBITMQ_PASSWORD || "guest",
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
