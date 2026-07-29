import { query } from "~/server/utils/db";
import { readBody } from "h3";
import { withErrorHandler, validateBody, badRequest } from "~/server/utils/api";
import { requireAuth } from "~/server/utils/auth";

export default defineEventHandler(
  withErrorHandler(async (event) => {
    requireAuth(event);

    const body = await readBody(event);

    const error = validateBody(body, [
      { field: "student_id", label: "Student", required: true, type: "number", min: 1 },
      { field: "attendance_date", label: "Attendance date", required: true, type: "date" },
      { field: "status", label: "Status", required: true, enum: ["present", "absent", "late", "leave"] },
    ]);

    if (error) badRequest(error);

    const [result] = await query(
      `INSERT INTO attendance (
        student_id,
        attendance_date,
        status
      )
      VALUES (?, ?, ?)`,
      [
        body.student_id,
        body.attendance_date,
        body.status,
      ]
    );

    return {
      success: true,
      message: "Attendance added successfully",
      id: result.insertId,
    };
  })
);
