import getPool from "~/server/utils/db";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);

    const pool = getPool();

    const [result] = await pool.query(
      `INSERT INTO fees (
        student_id,
        title,
        amount,
        paid_amount,
        due_date,
        paid_date,
        payment_method,
        note,
        status
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        body.student_id,
        body.title,
        body.amount,
        body.paid_amount,
        body.due_date,
        body.paid_date,
        body.payment_method,
        body.note,
        body.status
      ]
    );

    return {
      success: true,
      message: "Fee added successfully",
      id: result.insertId
    };

  } catch (error) {
    return {
      success: false,
      message: error.message
    };
  }
});