import { healthCheck, getDbConfigSummary } from "~/server/utils/db";

export default defineEventHandler(async () => {
  const summary = getDbConfigSummary();

  try {
    const result = await healthCheck();

    return {
      success: result.ok,
      latencyMs: result.latencyMs,
      // Only expose non-sensitive config for diagnostics.
      // The password is NEVER included.
      config: {
        host: summary.host,
        port: summary.port,
        database: summary.database,
        user: summary.user,
      },
      ...(result.error ? { error: result.error } : {}),
    };
  } catch (error: any) {
    console.error("debug-db error:", error);

    return {
      success: false,
      error: error.message,
      config: {
        host: summary.host,
        port: summary.port,
        database: summary.database,
        user: summary.user,
      },
    };
  }
});
