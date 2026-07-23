import getPool from "~/server/utils/db";

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, "id");
    const body = await readBody(event);

    const pool = getPool();

    const [result] = await pool.query(
      `UPDATE exams
       SET name=?,
           term=?,
           subject=?,
           class=?,
           exam_date=?,
           max_marks=?,
           pass_marks=?,
           note=?
       WHERE id=?`,
      [
        body.name,
        body.term,
        body.subject,
        body.class,
        body.exam_date,
        body.max_marks,
        body.pass_marks,
        body.note,
        id
      ]
    );

    return {
      success: true,
      message: "Exam updated successfully",
      affectedRows: result.affectedRows
    };

  } catch (error) {
    return {
      success: false,
      message: error.message
    };
  }
});