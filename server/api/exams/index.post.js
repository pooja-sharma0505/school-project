import getPool from "~/server/utils/db";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);

    const pool = getPool();

    const [result] = await pool.query(
      `INSERT INTO exams (
        name,
        term,
        subject,
        class,
        exam_date,
        max_marks,
        pass_marks,
        note
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        body.name,
        body.term,
        body.subject,
        body.class,
        body.exam_date,
        body.max_marks,
        body.pass_marks,
        body.note
      ]
    );

    return {
      success: true,
      message: "Exam added successfully",
      id: result.insertId
    };

  } catch (error) {
    return {
      success: false,
      message: error.message
    };
  }
});