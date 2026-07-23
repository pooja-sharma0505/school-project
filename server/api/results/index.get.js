import getPool from "~/server/utils/db";

export default defineEventHandler(async () => {
  try {
    const pool = getPool();

    const [rows] = await pool.query(`
      SELECT
        r.id,
        r.exam_id,
        r.student_id,
        r.marks_obtained,
        r.grade,
        r.status,

        s.first_name,
        s.last_name,
        s.roll_number,
        s.class,

        e.name AS exam_name,
        e.subject,
        e.term,
        e.max_marks
      FROM results r
      JOIN students s
        ON r.student_id = s.id
      JOIN exams e
        ON r.exam_id = e.id
      ORDER BY r.id DESC
    `);

    return rows;

  } catch (error) {
    return {
      success: false,
      message: error.message
    };
  }
});