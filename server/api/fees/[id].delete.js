import { query } from "~/server/utils/db";
import { withErrorHandler, requireAuth } from "~/server/utils/api";

export default defineEventHandler(
  withErrorHandler(async (event) => {
    requireAuth(event);

    const id = getRouterParam(event, "id");

    const [result] = await query(
      "DELETE FROM fees WHERE id = ?",
      [id]
    );

    return {
      success: true,
      message: "Fee deleted successfully",
      affectedRows: result.affectedRows,
    };
  })
);
