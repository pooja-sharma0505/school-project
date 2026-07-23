import getPool from "~/server/utils/db";
import { readBody } from "h3";

export default defineEventHandler(async (event) => {
  try {
    const id = event.context.params.id;
    const body = await readBody(event);

    const pool = getPool();

    await pool.query(
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
        body.class_teacher,
        body.room_number,
        body.capacity,
        body.status,
        id
      ]
    );

    return {
      success: true,
      message: "Class updated successfully."
    };

  } catch (error) {
    return {
      success: false,
      message: error.message
    };
  }
});