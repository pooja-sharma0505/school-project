import getPool from "~/server/utils/db";
import { readBody } from "h3";
import { withErrorHandler, validateBody, badRequest, requireAuth } from "~/server/utils/api";

export default defineEventHandler(
  withErrorHandler(async (event) => {
    requireAuth(event);

    const id = getRouterParam(event, "id");
    const body = await readBody(event);

    const error = validateBody(body, [
      { field: "class_id", label: "Class", required: true, type: "number", min: 1 },
      { field: "subject_name", label: "Subject name", required: true, type: "string", max: 100 },
      { field: "subject_code", label: "Subject code", type: "string", max: 50 },
      { field: "teacher_name", label: "Teacher name", type: "string", max: 100 },
      { field: "status", label: "Status", enum: ["active", "inactive"] },
    ]);

    if (error) badRequest(error);

    const pool = getPool();

    await pool.query(
      `
      UPDATE subjects
      SET
        class_id = ?,
        subject_name = ?,
        subject_code = ?,
        teacher_name = ?,
        status = ?
      WHERE id = ?
      `,
      [
        body.class_id,
        body.subject_name,
        body.subject_code || null,
        body.teacher_name || null,
        body.status || "active",
        id,
      ]
    );

    return {
      success: true,
      message: "Subject updated successfully.",
    };
  })
);
