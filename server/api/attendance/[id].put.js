import getPool from "~/server/utils/db";

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, "id");
    const body = await readBody(event);

    const pool = getPool();

    const [result] = await pool.query(
      `UPDATE attendance
       SET student_id = ?,
           attendance_date = ?,
           status = ?
       WHERE id = ?`,
      [
        body.student_id,
        body.attendance_date,
        body.status,
        id
      ]
    );

    return {
      success: true,
      message: "Attendance updated successfully",
      affectedRows: result.affectedRows
    };

  } catch (error) {
    return {
      success: false,
      message: error.message
    };
  }
});