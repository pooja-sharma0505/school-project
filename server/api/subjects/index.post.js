import { query } from "~/server/utils/db";
import { readBody } from "h3";
import { withErrorHandler, validateBody, badRequest } from "~/server/utils/api";
import { requireAuth } from "~/server/utils/auth";

export default defineEventHandler(
  withErrorHandler(async (event) => {
    requireAuth(event);

    const body = await readBody(event);

    const error = validateBody(body, [
      { field: "class_id", label: "Class", required: true, type: "number", min: 1 },
      { field: "subject_name", label: "Subject name", required: true, type: "string", max: 100 },
      { field: "subject_code", label: "Subject code", type: "string", max: 50 },
      { field: "teacher_name", label: "Teacher name", type: "string", max: 100 },
      { field: "status", label: "Status", enum: ["active", "inactive"] },
    ]);

    if (error) badRequest(error);

    const [result] = await query(
      `
      INSERT INTO subjects
      (
        class_id,
        subject_name,
        subject_code,
        teacher_name,
        status
      )
      VALUES
      (?, ?, ?, ?, ?)
      `,
      [
        body.class_id,
        body.subject_name,
        body.subject_code || null,
        body.teacher_name || null,
        body.status || "active",
      ]
    );

    return {
      success: true,
      id: result.insertId,
      message: "Subject added successfully.",
    };
  })
);
