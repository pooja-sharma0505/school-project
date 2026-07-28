import mysql from "mysql2/promise";

let pool: mysql.Pool | undefined;

// ─────────────────────────────────────────────────────────────────────────────
// Configuration validation
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Validate that all required database environment variables are present.
 * Throws a clear, actionable error if any are missing.
 */
function validateDbConfig(config: any): void {
  const required = ["dbHost", "dbPort", "dbUser", "dbPassword", "dbName"];
  const missing = required.filter((key) => !config[key]);

  if (missing.length > 0) {
    const varNames = missing
      .map((k) => {
        const map: Record<string, string> = {
          dbHost: "DB_HOST",
          dbPort: "DB_PORT",
          dbUser: "DB_USER",
          dbPassword: "DB_PASSWORD",
          dbName: "DB_NAME",
        };
        return map[k] || k;
      })
      .join(", ");

    throw new Error(
      `Database configuration incomplete — missing environment variable(s): ${varNames}. ` +
        "On Vercel, add these in Project Settings → Environment Variables. " +
        "Locally, copy .env.example to .env and fill in your values."
    );
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Pool management
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Get the shared database connection pool, creating it if necessary.
 *
 * The pool is cached at module level so that within a single serverless
 * invocation (warm start) the same pool is reused.
 */
export default function getPool() {
  if (!pool) {
    const config = {
      dbHost: process.env.DB_HOST || "",
      dbPort: process.env.DB_PORT || "3306",
      dbUser: process.env.DB_USER || "",
      dbPassword: process.env.DB_PASSWORD || "",
      dbName: process.env.DB_NAME || "",
    };

    try {
      validateDbConfig(config);
    } catch (error) {
      console.error("DB CONFIG ERROR:", (error as Error).message);
      throw error;
    }

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

      // Increased from 3 to 10 for better concurrent throughput.
      // On Vercel serverless, each invocation gets its own pool, so a higher
      // limit allows more parallel queries within a single warm instance.
      connectionLimit: 10,

      queueLimit: 0,

      enableKeepAlive: true,
      keepAliveInitialDelay: 0,

      // Timeout settings — prevents hanging when the DB drops idle
      // connections or when the pool is temporarily unavailable.
      connectTimeout: 60000,
      idleTimeout: 60000,
    });

    // Log pool-level errors without exposing secrets.
    (pool as any).on("error", (err: any) => {
      console.error("DB POOL ERROR:", err?.message || err);
    });
  }

  return pool;
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

/** Sleep for the given number of milliseconds. */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Check if an error is transient (i.e. worth retrying).
 */
function isTransientError(error: any): boolean {
  const transientCodes = [
    "PROTOCOL_CONNECTION_LOST",
    "PROTOCOL_ENQUEUE_AFTER_FATAL_ERROR",
    "PROTOCOL_HOST_NOT_ALLOWED",
    "ECONNREFUSED",
    "ECONNRESET",
    "ETIMEDOUT",
    "ENOTFOUND",
    "ER_CON_COUNT_ERROR",
    "ER_DB_SERVER_HAS_GONE_AWAY",
    "ER_QUERY_INTERRUPTED",
    "ER_LOCK_WAIT_TIMEOUT",
    "ER_LOCK_DEADLOCK",
  ];

  const code = error?.code || "";
  const message = error?.message || "";

  return (
    transientCodes.includes(code) ||
    transientCodes.some((c) => message.includes(c))
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Query execution
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Execute a SQL query using the shared connection pool.
 *
 * OPTIMISATION: Removed console.time/console.timeEnd from the hot path.
 * These calls add measurable overhead on every query in production.
 * If timing is needed, use a debug flag.
 *
 * @param sql     - The SQL query string (use ? placeholders for parameters)
 * @param params  - Array of parameter values for the placeholders
 * @param options - Optional settings:
 *   - safe:    If true, returns [[], null] on error instead of throwing.
 *   - retries: Number of retry attempts for transient failures (default: 2).
 * @returns A tuple of [rows, fields]
 */
export async function query(
  sql: string,
  params?: any[],
  options?: { safe?: boolean; retries?: number }
): Promise<any> {
  const maxRetries = options?.retries ?? 2;

  let lastError: any;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const pool = getPool();
      const result = await pool.query(sql, params);
      // pool.query returns [rows, fields]; callers destructure as [rows]
      return result;
    } catch (error: any) {
      lastError = error;
      const isTransient = isTransientError(error);

      // Only log on the final attempt to reduce log noise
      if (attempt >= maxRetries) {
        console.error(
          "DB QUERY ERROR (final):",
          error?.message || error
        );
      }

      // If safe mode, return an empty result instead of throwing.
      if (options?.safe) {
        return [[], null];
      }

      // If not a transient error, or no retries left, throw immediately.
      if (!isTransient || attempt >= maxRetries) {
        throw error;
      }

      // Wait before retrying (exponential backoff: 500ms, 1s, 2s, ...).
      const delay = Math.pow(2, attempt) * 500;
      await sleep(delay);
    }
  }

  throw lastError;
}

/**
 * Execute a SELECT query and return just the rows.
 */
export async function safeQuery(sql: string, params?: any[]): Promise<any[]> {
  const [rows] = await query(sql, params);
  return rows;
}

// ─────────────────────────────────────────────────────────────────────────────
// Health check
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Run a simple health check against the database.
 */
export async function healthCheck(): Promise<{
  ok: boolean;
  latencyMs?: number;
  error?: string;
}> {
  const start = Date.now();
  try {
    await query("SELECT 1 AS health_check");
    return { ok: true, latencyMs: Date.now() - start };
  } catch (error: any) {
    return { ok: false, error: error?.message || String(error) };
  }
}

/**
 * Get a safe summary of the database configuration for diagnostics.
 * Does NOT include the password.
 */
export function getDbConfigSummary(): {
  host: string;
  port: string | number;
  database: string;
  user: string;
} {
  return {
    host: process.env.DB_HOST || "",
    port: process.env.DB_PORT || "3306",
    database: process.env.DB_NAME || "",
    user: process.env.DB_USER || "",
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Pool teardown
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Close the shared pool. Useful for graceful shutdown.
 */
export async function closePool(): Promise<void> {
  if (pool) {
    try {
      await pool.end();
    } catch (e) {
      // Ignore errors during shutdown
    }
    pool = undefined;
  }
}
