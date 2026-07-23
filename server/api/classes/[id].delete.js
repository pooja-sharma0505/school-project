import getPool from "~/server/utils/db";

export default defineEventHandler(async (event) => {
  try {
    const id = event.context.params.id;

    const pool = getPool();

    await pool.query(
      "DELETE FROM classes WHERE id = ?",
      [id]
    );

    return {
      success: true,
      message: "Class deleted successfully."
    };

  } catch (error) {
    return {
      success: false,
      message: error.message
    };
  }
});