import getPool from "~/server/utils/db";
import { withErrorHandler } from "~/server/utils/api";

export default defineEventHandler(
  withErrorHandler(async () => {
    try {
      const pool = getPool();

      const [rows] = await pool.query(
        "SELECT * FROM students ORDER BY id DESC"
      );

      return rows;
    } catch (error) {
      console.error("Students API Error:", error);
      throw error;
    }
  })
);