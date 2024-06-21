/* eslint-disable unicorn/prefer-ternary */

import { expect } from "vitest"
import { pool } from "@/common/database/index.js"
const poolPromise = pool.promise()

expect.extend({
  async toHaveRowInTable(data: Record<string, any>, tableName: string) {
    const { isNot } = this
    let query = `SELECT COUNT(*) AS count FROM \`${tableName}\` WHERE `
    const conditions = Object.keys(data)
      .map((key) => `\`${key}\` = ?`)
      .join(" AND ")
    query += conditions + ";"

    const values = Object.values(data)

    try {
      const [rows] = await poolPromise.query(query, values)

      const hasRow = rows[0].count > 0

      return {
        message: () =>
          `expected table ${tableName} ${isNot ? "not" : ""} to have row matching ${JSON.stringify(
            data
          )}`,
        pass: hasRow,
      }
    } catch (error: any) {
      return {
        message: () => `${error?.message}`,
        pass: false,
      }
    }
  },
})
