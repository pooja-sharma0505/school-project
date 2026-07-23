import getPool from "~/server/utils/db";

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, "id");

    const pool = getPool();

    const [result] = await pool.query(
      "DELETE FROM students WHERE id = ?",
      [id]
    );

    return {
      success: true,
      message: "Student deleted successfully",
      affectedRows: result.affectedRows
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      message: error.message
    };
  }
});