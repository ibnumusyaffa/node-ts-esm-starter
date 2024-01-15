/*
Warning:
- The scheduler is only to send job to the queue not for executing the actual tasks.
- There should be only one process/instance of the scheduler running at a time to prevent duplicated jobs.
*/

import { Cron } from "croner"
import { logger } from "./shared/logger.js"
import { forgotPasswordEmail } from "@/features/users/jobs/users.queue.js"

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
    await forgotPasswordEmail({ name: "ibnu", email: "ibnu@gmail.com", link: "" })
  }
)
