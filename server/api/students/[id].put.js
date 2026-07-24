import { query } from "~/server/utils/db";
import { readBody } from "h3";
import { withErrorHandler, validateBody, badRequest, requireAuth } from "~/server/utils/api";

export default defineEventHandler(
  withErrorHandler(async (event) => {
    requireAuth(event);

    const id = getRouterParam(event, "id");
    const body = await readBody(event);

    const error = validateBody(body, [
      { field: "first_name", label: "First name", required: true, type: "string", max: 100 },
      { field: "last_name", label: "Last name", required: true, type: "string", max: 100 },
      { field: "email", label: "Email", type: "email" },
      { field: "phone", label: "Phone", type: "string", max: 20 },
      { field: "gender", label: "Gender", enum: ["male", "female", "other"] },
      { field: "date_of_birth", label: "Date of birth", type: "date" },
      { field: "class", label: "Class", type: "string", max: 50 },
      { field: "section", label: "Section", type: "string", max: 10 },
      { field: "roll_number", label: "Roll number", type: "string", max: 20 },
      { field: "address", label: "Address", type: "string", max: 500 },
      { field: "guardian_name", label: "Guardian name", type: "string", max: 100 },
      { field: "guardian_phone", label: "Guardian phone", type: "string", max: 20 },
      { field: "status", label: "Status", enum: ["active", "inactive", "suspended"] },
    ]);

    if (error) badRequest(error);

    const [result] = await query(
      `UPDATE students SET
        first_name=?,
        last_name=?,
        email=?,
        phone=?,
        gender=?,
        date_of_birth=?,
        class=?,
        section=?,
        roll_number=?,
        address=?,
        guardian_name=?,
        guardian_phone=?,
        status=?
      WHERE id=?`,
      [
        body.first_name,
        body.last_name,
        body.email || null,
        body.phone || null,
        body.gender || null,
        body.date_of_birth || null,
        body.class || null,
        body.section || null,
        body.roll_number || null,
        body.address || null,
        body.guardian_name || null,
        body.guardian_phone || null,
        body.status || "active",
        id,
      ]
    );

    return {
      success: true,
      message: "Student updated successfully",
      affectedRows: result.affectedRows,
    };
  })
);
