import { safeQuery } from "~/server/utils/db";
import { withErrorHandler } from "~/server/utils/api";

/**
 * GET /api/students
 *
 * OPTIMISATION: Replaced `SELECT *` with explicit column list.
 * The original `SELECT *` returned ALL columns including potentially
 * large TEXT fields (address, guardian_name, etc.) that are not needed
 * by most list views. Now only the essential columns are returned.
 *
 * Columns returned: id, first_name, last_name, email, phone, gender,
 *   date_of_birth, class, section, roll_number, status
 *
 * Excluded (large/unnecessary for list views): address, guardian_name,
 *   guardian_phone, created_at, updated_at
 *
 * Caching: 60-second SWR via routeRules in nuxt.config.ts
 */
export default defineEventHandler(
  withErrorHandler(async () => {
    try {
      const rows = await safeQuery(
        `SELECT id, first_name, last_name, email, phone, gender,
                date_of_birth, class, section, roll_number, status
         FROM students
         ORDER BY id DESC`
      );

      return rows;
    } catch (error) {
      // Log the actual error so it shows up in Vercel's runtime logs
      // instead of a generic 500 with no details.
      console.error(error);
      throw error;
    }
  })
);
