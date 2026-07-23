import getPool from "~/server/utils/db";

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, "id");

    const pool = getPool();

    const [result] = await pool.query(
      "DELETE FROM results WHERE id = ?",
      [id]
    );

    return {
      success: true,
      message: "Result deleted successfully",
      affectedRows: result.affectedRows
    };

  } catch (error) {
    return {
      success: false,
      message: error.message
    };
  }
});