import mysql from "mysql2/promise";

let pool: mysql.Pool | undefined;

export default function getPool() {
  if (!pool) {
    const config = useRuntimeConfig();

    pool = mysql.createPool({
      host: config.dbHost,
      port: Number(config.dbPort),
      user: config.dbUser,
      password: config.dbPassword,
      database: config.dbName,

      ssl: {
        rejectUnauthorized: false,
      },

      waitForConnections: true,

      // IMPORTANT: Clever Cloud only allows 5 total connections.
      // Vercel can run multiple serverless instances, so keep this low.
      connectionLimit: 1,

      queueLimit: 0,

      enableKeepAlive: true,
      keepAliveInitialDelay: 0,
    });
  }

  return pool;
}