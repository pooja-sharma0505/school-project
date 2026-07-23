import getPool from "~/server/utils/db";

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, "id");
    const body = await readBody(event);

    const pool = getPool();

    const [result] = await pool.query(
      `UPDATE fees
       SET student_id=?,
           title=?,
           amount=?,
           paid_amount=?,
           due_date=?,
           paid_date=?,
           payment_method=?,
           note=?,
           status=?
       WHERE id=?`,
      [
        body.student_id,
        body.title,
        body.amount,
        body.paid_amount,
        body.due_date,
        body.paid_date,
        body.payment_method,
        body.note,
        body.status,
        id
      ]
    );

    return {
      success: true,
      message: "Fee updated successfully",
      affectedRows: result.affectedRows
    };

  } catch (error) {
    return {
      success: false,
      message: error.message
    };
  }
});