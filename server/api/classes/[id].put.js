import { query } from "~/server/utils/db";
import { readBody } from "h3";
import { withErrorHandler, validateBody, badRequest } from "~/server/utils/api";
import { requireAuth } from "~/server/utils/auth";

export default defineEventHandler(
  withErrorHandler(async (event) => {
    requireAuth(event);

    const id = getRouterParam(event, "id");
    const body = await readBody(event);

    const error = validateBody(body, [
      { field: "class_name", label: "Class name", required: true, type: "string", max: 100 },
      { field: "section", label: "Section", required: true, type: "string", max: 10 },
      { field: "class_teacher", label: "Class teacher", type: "string", max: 100 },
      { field: "room_number", label: "Room number", type: "string", max: 20 },
      { field: "capacity", label: "Capacity", type: "number", min: 0, max: 9999 },
      { field: "status", label: "Status", enum: ["active", "inactive"] },
    ]);

    if (error) badRequest(error);

    await query(
      `
      UPDATE classes
      SET
        class_name = ?,
        section = ?,
        class_teacher = ?,
        room_number = ?,
        capacity = ?,
        status = ?
      WHERE id = ?
      `,
      [
        body.class_name,
        body.section,
        body.class_teacher || null,
        body.room_number || null,
        body.capacity !== undefined ? Number(body.capacity) : null,
        body.status || "active",
        id,
      ]
    );

    return {
      success: true,
      message: "Class updated successfully.",
    };
  })
);
