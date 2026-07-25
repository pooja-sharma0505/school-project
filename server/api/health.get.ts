import { healthCheck } from "~/server/utils/db";

/**
 * Simple health-check endpoint.
 *
 * Returns 200 with { ok: true, latencyMs } when the database is reachable,
 * and 503 with { ok: false, error } when it is not.
 *
 * Useful for:
 *   - Vercel / hosting uptime checks
 *   - Frontend "is the backend alive?" probes
 *   - CI/CD smoke tests after deployment
 */
export default defineEventHandler(async (event) => {
  const result = await healthCheck();

  if (result.ok) {
    return {
      ok: true,
      status: "healthy",
      latencyMs: result.latencyMs,
      timestamp: new Date().toISOString(),
    };
  }

  // Use 503 Service Unavailable so load balancers / health-check
  // monitors correctly detect the backend as down.
  throw createError({
    statusCode: 503,
    statusMessage: "Service Unavailable",
    data: {
      ok: false,
      status: "unhealthy",
      error: result.error,
      timestamp: new Date().toISOString(),
    },
  });
});
