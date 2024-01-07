/*
Warning:
- The scheduler is only to send job to the queue not for executing the actual tasks.
- There should be only one process of the scheduler running at a time to prevent duplicated jobs.
*/

import { Cron } from "croner"
import { logger } from "./shared/logger.js"
import { sendEmail } from "@/features/users/queues/jobs.js"

function errorHandler(e: unknown, job: Cron) {
  logger.error(`"${job.name}" job failed at ${job.currentRun()}`)
}

Cron(
  "* * * * * *",
  {
    name: "hello",
    catch: errorHandler,
  },
  async (v: Cron) => {
    await sendEmail(`hello ${Math.random()}`)
  }
)
