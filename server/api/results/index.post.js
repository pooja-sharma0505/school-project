import getPool from "~/server/utils/db";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);

    const pool = getPool();

    const [result] = await pool.query(
      `INSERT INTO results (
        exam_id,
        student_id,
        marks_obtained,
        grade,
        status
      )
      VALUES (?, ?, ?, ?, ?)`,
      [
        body.exam_id,
        body.student_id,
        body.marks_obtained,
        body.grade,
        body.status
      ]
    );

    return {
      success: true,
      message: "Result added successfully",
      id: result.insertId
    };

  } catch (error) {
    return {
      success: false,
      message: error.message
    };
  }
});