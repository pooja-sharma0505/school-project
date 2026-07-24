import getPool from "~/server/utils/db";
import { withErrorHandler, requireAuth } from "~/server/utils/api";

export default defineEventHandler(
  withErrorHandler(async (event) => {
    requireAuth(event);

    const id = getRouterParam(event, "id");

    const pool = getPool();

    await pool.query(
      "DELETE FROM subjects WHERE id = ?",
      [id]
    );

    return {
      success: true,
      message: "Subject deleted successfully.",
    };
  })
);
