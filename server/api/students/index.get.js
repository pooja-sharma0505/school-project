import getPool from "~/server/utils/db";

export default defineEventHandler(async () => {
  const pool = getPool();

  const [rows] = await pool.query(
    "SELECT * FROM students ORDER BY id DESC"
  );

  return rows;
});