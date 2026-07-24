import getPool from "~/server/utils/db";
import { withErrorHandler, requireAuth } from "~/server/utils/api";

export default defineEventHandler(
  withErrorHandler(async (event) => {
    requireAuth(event);

    const id = getRouterParam(event, "id");

    const pool = getPool();

    const [result] = await pool.query(
      "DELETE FROM students WHERE id = ?",
      [id]
    );

    return {
      success: true,
      message: "Student deleted successfully",
      affectedRows: result.affectedRows,
    };
  })
);
