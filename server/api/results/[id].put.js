import getPool from "~/server/utils/db";
import { readBody } from "h3";
import { withErrorHandler, validateBody, badRequest, requireAuth } from "~/server/utils/api";

export default defineEventHandler(
  withErrorHandler(async (event) => {
    requireAuth(event);

    const id = getRouterParam(event, "id");
    const body = await readBody(event);

    const error = validateBody(body, [
      { field: "exam_id", label: "Exam", required: true, type: "number", min: 1 },
      { field: "student_id", label: "Student", required: true, type: "number", min: 1 },
      { field: "marks_obtained", label: "Marks obtained", type: "number", min: 0, max: 10000 },
      { field: "grade", label: "Grade", type: "string", max: 10 },
      { field: "status", label: "Status", enum: ["pass", "fail"] },
    ]);

    if (error) badRequest(error);

    const pool = getPool();

    const [result] = await pool.query(
      `UPDATE results
       SET exam_id=?,
           student_id=?,
           marks_obtained=?,
           grade=?,
           status=?
       WHERE id=?`,
      [
        body.exam_id,
        body.student_id,
        body.marks_obtained !== undefined ? Number(body.marks_obtained) : null,
        body.grade || null,
        body.status || null,
        id,
      ]
    );

    return {
      success: true,
      message: "Result updated successfully",
      affectedRows: result.affectedRows,
    };
  })
);
