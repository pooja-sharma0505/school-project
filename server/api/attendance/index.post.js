import getPool from "~/server/utils/db";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);

    const pool = getPool();

    const [result] = await pool.query(
      `INSERT INTO attendance (
        student_id,
        attendance_date,
        status
      )
      VALUES (?, ?, ?)`,
      [
        body.student_id,
        body.attendance_date,
        body.status
      ]
    );

    return {
      success: true,
      message: "Attendance added successfully",
      id: result.insertId
    };

  } catch (error) {
    return {
      success: false,
      message: error.message
    };
  }
});