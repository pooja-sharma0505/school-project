import getPool from "~/server/utils/db";
import { readBody } from "h3";
import { withErrorHandler, validateBody, badRequest, requireAuth } from "~/server/utils/api";

export default defineEventHandler(
  withErrorHandler(async (event) => {
    requireAuth(event);

    const id = getRouterParam(event, "id");
    const body = await readBody(event);

    const error = validateBody(body, [
      { field: "student_id", label: "Student", required: true, type: "number", min: 1 },
      { field: "attendance_date", label: "Attendance date", required: true, type: "date" },
      { field: "status", label: "Status", required: true, enum: ["present", "absent", "late", "leave"] },
    ]);

    if (error) badRequest(error);

    const pool = getPool();

    const [result] = await pool.query(
      `UPDATE attendance
       SET student_id = ?,
           attendance_date = ?,
           status = ?
       WHERE id = ?`,
      [
        body.student_id,
        body.attendance_date,
        body.status,
        id,
      ]
    );

    return {
      success: true,
      message: "Attendance updated successfully",
      affectedRows: result.affectedRows,
    };
  })
);
