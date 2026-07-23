import getPool from "~/server/utils/db";

export default defineEventHandler(async () => {
  try {
    const pool = getPool();

    const [rows] = await pool.query(`
      SELECT
        attendance.id,
        attendance.student_id,
        attendance.attendance_date,
        attendance.status,
        students.first_name,
        students.last_name,
        students.roll_number,
        students.class
      FROM attendance
      JOIN students
      ON attendance.student_id = students.id
      ORDER BY attendance.attendance_date DESC
    `);

    return rows;

  } catch (error) {
    return {
      success: false,
      message: error.message
    };
  }
});