import { query } from "~/server/utils/db";
import { withErrorHandler } from "~/server/utils/api";
import { requireAuth } from "~/server/utils/auth";

export default defineEventHandler(
  withErrorHandler(async (event) => {
    requireAuth(event);

    const id = getRouterParam(event, "id");

    await query(
      "DELETE FROM subjects WHERE id = ?",
      [id]
    );

    return {
      success: true,
      message: "Subject deleted successfully.",
    };
  })
);
