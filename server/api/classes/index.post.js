import getPool from "~/server/utils/db";
import { readBody } from "h3";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const pool = getPool();

    const [result] = await pool.query(
      `
      INSERT INTO classes (
        class_name,
        section,
        class_teacher,
        room_number,
        capacity,
        status
      )
      VALUES (?, ?, ?, ?, ?, ?)
      `,
      [
        body.class_name,
        body.section,
        body.class_teacher,
        body.room_number,
        body.capacity,
        body.status
      ]
    );

    return {
      success: true,
      id: result.insertId,
      message: "Class added successfully."
    };

  } catch (error) {
    return {
      success: false,
      message: error.message
    };
  }
});