import mysql from "mysql2/promise";

let pool: mysql.Pool;

export default function getPool() {
  if (!pool) {
    const config = useRuntimeConfig();

    pool = mysql.createPool({
      host: config.dbHost,
      port: Number(config.dbPort),
      user: config.dbUser,
      password: config.dbPassword,
      database: config.dbName,

      // Add this
      ssl: {
        rejectUnauthorized: false,
      },

      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
  }

  return pool;
}