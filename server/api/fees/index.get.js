import getPool from "~/server/utils/db";

export default defineEventHandler(async () => {
  try {
    const pool = getPool();

    const [rows] = await pool.query(`
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

  } catch (error) {
    return {
      success: false,
      message: error.message
    };
  }
});