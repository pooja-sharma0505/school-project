import getConnection from "~/server/utils/db";

export default defineEventHandler(async () => {
  const connection = await getConnection();

  try {
    const [rows] = await connection.query(
      "SELECT * FROM students ORDER BY id DESC"
    );

    return rows;
  } finally {
    await connection.end();
  }
});