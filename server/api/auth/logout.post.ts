import { deleteCookie } from "h3";

/**
 * Logout endpoint — clears the auth cookie.
 *
 * Always returns success, even if no cookie was set.
 */
export default defineEventHandler(async (event) => {
  deleteCookie(event, "auth_token", { path: "/" });

  return {
    success: true,
    message: "Logged out successfully",
  };
});
