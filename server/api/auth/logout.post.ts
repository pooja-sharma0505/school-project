import { clearAuthCookie } from "~/server/utils/auth";

/**
 * Logout endpoint — clears the JWT auth cookie.
 *
 * Uses clearAuthCookie (which calls deleteCookie with matching httpOnly,
 * secure, and sameSite options) to ensure the cookie is properly removed
 * across all browsers and serverless instances.
 *
 * Always returns success, even if no cookie was set.
 */
export default defineEventHandler(async (event) => {
  clearAuthCookie(event);

  return {
    success: true,
    message: "Logged out successfully",
  };
});
