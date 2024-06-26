/*
Warning:
- The scheduler is only to send job to the queue not for executing the actual tasks.
- There should be only one process/instance of the scheduler running at a time to prevent duplicated jobs.
*/

import { Cron } from "croner"
import { logger } from "./common/logger.js"

function handleError(e: unknown, job: Cron) {
  logger.error(`"${job.name}" job failed at ${job.currentRun()}`)
}

Cron(
  "* * * * * *",
  {
    name: "hello",
    catch: handleError,
  },
  async (v: Cron) => {
    console.log("do something")
  }
)
