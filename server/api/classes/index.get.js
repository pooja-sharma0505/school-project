import getPool from "~/server/utils/db";

export default defineEventHandler(async () => {
  try {
    const pool = getPool();

    const [rows] = await pool.query(`
      SELECT
        id,
        class_name,
        section,
        class_teacher,
        room_number,
        capacity,
        status,
        created_at,
        updated_at
      FROM classes
      ORDER BY class_name ASC, section ASC
    `);

    return rows;

  } catch (error) {

    return {
      success: false,
      message: error.message
    };

  }
});