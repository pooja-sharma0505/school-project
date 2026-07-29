import { query } from "~/server/utils/db";
import { withErrorHandler } from "~/server/utils/api";
import { requireAuth } from "~/server/utils/auth";

export default defineEventHandler(
  withErrorHandler(async (event) => {
    requireAuth(event);

    const id = getRouterParam(event, "id");

    const [result] = await query(
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
