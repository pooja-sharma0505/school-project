import getPool from "~/server/utils/db";

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, "id");
    const body = await readBody(event);

    const pool = getPool();

    const [result] = await pool.query(
      `UPDATE results
       SET exam_id=?,
           student_id=?,
           marks_obtained=?,
           grade=?,
           status=?
       WHERE id=?`,
      [
        body.exam_id,
        body.student_id,
        body.marks_obtained,
        body.grade,
        body.status,
        id
      ]
    );

    return {
      success: true,
      message: "Result updated successfully",
      affectedRows: result.affectedRows
    };

  } catch (error) {
    return {
      success: false,
      message: error.message
    };
  }
});