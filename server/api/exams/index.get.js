import getPool from "~/server/utils/db";

export default defineEventHandler(async () => {
  try {
    const pool = getPool();

    const [rows] = await pool.query(`
      SELECT *
      FROM exams
      ORDER BY exam_date DESC
    `);

    return rows;

  } catch (error) {
    return {
      success: false,
      message: error.message
    };
  }
});