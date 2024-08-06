import { migrate } from "@/common/database/index.js"
import { StartedTestContainer } from "testcontainers"
import { rabbitMQ, mysql } from "@/tests/utils/container.js"

let containers: StartedTestContainer[] = []
export async function setup() {
  const startTime = performance.now()

  containers = await Promise.all([rabbitMQ(), mysql()])
  await migrate()

  const timeTaken = performance.now() - startTime
  console.info(`setup took ${timeTaken.toFixed(0)} ms.`)
}

export async function teardown() {
  for (const item of containers) {
    item.stop()
  }
}
