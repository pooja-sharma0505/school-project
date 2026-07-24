import { query } from "~/server/utils/db";
import { withErrorHandler } from "~/server/utils/api";

export default defineEventHandler(
  withErrorHandler(async () => {
    const [rows] = await query(`
      SELECT
        id,
        class_name,
        section,
        class_teacher,
        room_number,
        capacity,
        status,
        created_at,
        updated_at
      FROM classes
      ORDER BY class_name ASC, section ASC
    `);

    return rows;
  })
);
