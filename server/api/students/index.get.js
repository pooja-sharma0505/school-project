import { safeQuery } from "~/server/utils/db";
import { withErrorHandler } from "~/server/utils/api";

export default defineEventHandler(
  withErrorHandler(async () => {
    const rows = await safeQuery(
      "SELECT * FROM students ORDER BY id DESC"
    );

    return rows;
  })
);
