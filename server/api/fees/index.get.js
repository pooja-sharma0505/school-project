import { query } from "~/server/utils/db";
import { withErrorHandler } from "~/server/utils/api";

export default defineEventHandler(
  withErrorHandler(async () => {
    const [rows] = await query(`
      SELECT
        f.id,
        f.student_id,
        f.title,
        f.amount,
        f.paid_amount,
        f.due_date,
        f.paid_date,
        f.payment_method,
        f.note,
        f.status,

        s.first_name,
        s.last_name,
        s.roll_number,
        s.class

      FROM fees f
      JOIN students s
        ON f.student_id = s.id

      ORDER BY f.id DESC
    `);

    return rows;
  })
);
