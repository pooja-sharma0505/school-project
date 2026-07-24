import { query } from "~/server/utils/db";
import { withErrorHandler } from "~/server/utils/api";

export default defineEventHandler(
  withErrorHandler(async () => {
    const [rows] = await query(`
      SELECT *
      FROM exams
      ORDER BY exam_date DESC
    `);

    return rows;
  })
);
