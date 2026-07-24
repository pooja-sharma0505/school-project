import { query } from "~/server/utils/db";

export default defineEventHandler(async () => {
  const config = useRuntimeConfig();

  try {
    const [rows] = await query("SELECT NOW() AS time");

    return {
      success: true,
      runtime: {
        host: config.dbHost,
        port: config.dbPort,
        database: config.dbName,
        user: config.dbUser,
      },
      rows,
    };
  } catch (error: any) {
    console.error(error);

    return {
      success: false,
      message: error.message,
      code: error.code,
      errno: error.errno,
      sqlState: error.sqlState,
      stack: error.stack,
    };
  }
});
