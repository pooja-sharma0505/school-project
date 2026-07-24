import getPool from "~/server/utils/db";
import { withErrorHandler, requireAuth } from "~/server/utils/api";

export default defineEventHandler(
  withErrorHandler(async (event) => {
    requireAuth(event);

    const id = getRouterParam(event, "id");

    const pool = getPool();

    const [result] = await pool.query(
      "DELETE FROM attendance WHERE id = ?",
      [id]
    );

    return {
      success: true,
      message: "Attendance deleted successfully",
      affectedRows: result.affectedRows,
    };
  })
);
