import { safeQuery } from "~/server/utils/db";
import { withErrorHandler } from "~/server/utils/api";

export default defineEventHandler(
  withErrorHandler(async () => {
    const rows = await safeQuery(`
      SELECT *
      FROM exams
      ORDER BY exam_date DESC
    `);

    return rows;
  })
);
