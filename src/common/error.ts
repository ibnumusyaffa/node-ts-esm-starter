import { logger } from "@/common/logger.js"
export function handleError(err: unknown) {
  logger.error(err)
}
