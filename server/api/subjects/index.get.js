import { query } from "~/server/utils/db";
import { withErrorHandler } from "~/server/utils/api";

export default defineEventHandler(
  withErrorHandler(async () => {
    const [rows] = await query(`
      SELECT
        s.id,
        s.class_id,
        s.subject_name,
        s.subject_code,
        s.teacher_name,
        s.status,
        s.created_at,
        s.updated_at,

        c.class_name,
        c.section

      FROM subjects s

      LEFT JOIN classes c
        ON s.class_id = c.id

      ORDER BY
        c.class_name ASC,
        c.section ASC,
        s.subject_name ASC
    `);

    return rows;
  })
);
