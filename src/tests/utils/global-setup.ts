import { migrate } from "@/common/database/index.js"
import { GenericContainer, StartedTestContainer } from "testcontainers"

let containers: StartedTestContainer[] = []
export async function setup() {
  // RabbitMQ container
  const startTime = performance.now()
  const rabbitmqContainer = new GenericContainer("rabbitmq:3-management")
    .withEnvironment({
      RABBITMQ_DEFAULT_USER: "guest",
      RABBITMQ_DEFAULT_PASS: "guest",
    })
    .withExposedPorts(
      {
        container: 5672,
        host: 5672,
      },
      {
        container: 15_672,
        host: 15_672,
      }
    )
    .withReuse()
    .start()

  // MySQL container
  const mysqlContainer = new GenericContainer("mysql:8.0-debian")
    .withEnvironment({
      MYSQL_ROOT_PASSWORD: "password",
      MYSQL_DATABASE: "starterdb",
      MYSQL_USER: "user",
      MYSQL_PASSWORD: "password",
    })
    .withExposedPorts({
      container: 3306,
      host: 3309,
    })
    .withReuse()
    .start()
  containers = await Promise.all([rabbitmqContainer, mysqlContainer])
  await migrate()

  const endTime = performance.now()
  const timeTaken = endTime - startTime

  console.log(`setup took ${timeTaken.toFixed(0)} ms.`)
}

export async function teardown() {
  const isCI = false
  if (isCI) {
    for (const item of containers) {
      await item.stop()
    }
  }
}
