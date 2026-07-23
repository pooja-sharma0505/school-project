import getPool from "~/server/utils/db";

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, "id");

    const pool = getPool();

    const [result] = await pool.query(
      "DELETE FROM attendance WHERE id = ?",
      [id]
    );

    return {
      success: true,
      message: "Attendance deleted successfully",
      affectedRows: result.affectedRows
    };

  } catch (error) {
    return {
      success: false,
      message: error.message
    };
  }
});