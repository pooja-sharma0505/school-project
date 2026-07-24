import { query } from "~/server/utils/db";
import { withErrorHandler, requireAuth } from "~/server/utils/api";

export default defineEventHandler(
  withErrorHandler(async (event) => {
    requireAuth(event);

    const id = getRouterParam(event, "id");

    await query(
      "DELETE FROM classes WHERE id = ?",
      [id]
    );

    return {
      success: true,
      message: "Class deleted successfully.",
    };
  })
);
