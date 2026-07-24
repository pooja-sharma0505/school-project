import getPool from "~/server/utils/db";
import { withErrorHandler } from "~/server/utils/api";

export default defineEventHandler(
  withErrorHandler(async () => {
    const pool = getPool();

    const [rows] = await pool.query(`
      SELECT *
      FROM exams
      ORDER BY exam_date DESC
    `);

    return rows;
  })
);
