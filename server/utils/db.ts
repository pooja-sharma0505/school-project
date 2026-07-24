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
      // With connectionLimit: 1, each warm serverless instance uses at most
      // 1 connection. Even with 5 concurrent cold-start instances we stay
      // within the Clever Cloud limit.
      connectionLimit: 1,

      queueLimit: 0,

      enableKeepAlive: true,
      keepAliveInitialDelay: 0,

      // Timeout settings — prevents hanging when Clever Cloud drops idle
      // connections or when the pool is temporarily unavailable.
      // mysql2 v3 renamed these: connectTimeout (initial conn) and
      // idleTimeout (idle conn cleanup).
      connectTimeout: 60000, // 60s to establish the initial connection
      idleTimeout: 60000,    // 60s idle before a connection is recycled
    });

    // Log pool-level errors (e.g. connection lost) without exposing secrets.
    // The pool auto-reconnects on the next query, so we only log here.
    // Cast to any because mysql2 v3 types don't list 'error' as a typed
    // event on Pool, but Pool extends EventEmitter so it works at runtime.
    (pool as any).on("error", (err: any) => {
      console.error("DB POOL ERROR:", err?.message || err);
    });
  }

  return pool;
}

/**
 * Execute a SQL query using the shared connection pool.
 *
 * This is the SINGLE, consistent way every API route should run queries.
 * The pool handles connection acquisition and release internally, so
 * callers NEVER need to call connection.end() or connection.release().
 *
 * @param sql    - The SQL query string (use ? placeholders for parameters)
 * @param params - Array of parameter values for the placeholders
 * @returns A tuple of [rows, fields] — identical to mysql2's pool.query()
 */
export async function query(
  sql: string,
  params?: any[]
): Promise<[any[], any]> {
  const pool = getPool();
  try {
    return await pool.query(sql, params);
  } catch (error: any) {
    // Log the error message only — never log the SQL with embedded params
    // or any connection credentials.
    console.error("DB QUERY ERROR:", error?.message || error);
    throw error;
  }
}
