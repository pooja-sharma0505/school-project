import { safeQuery } from "~/server/utils/db";
import { withErrorHandler } from "~/server/utils/api";

/**
 * GET /api/exams
 *
 * OPTIMISATION: Replaced `SELECT *` with explicit column list.
 * Caching: 120-second SWR via routeRules in nuxt.config.ts
 */
export default defineEventHandler(
  withErrorHandler(async () => {
    const rows = await safeQuery(`
      SELECT id, name, term, subject, class, exam_date, max_marks, pass_marks, note
      FROM exams
      ORDER BY exam_date DESC
    `);

    return rows;
  })
);