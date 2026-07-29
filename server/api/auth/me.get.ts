import { getAuthUser } from "~/server/utils/auth";

/**
 * GET /api/auth/me
 *
 * Reads the `auth_token` JWT cookie, verifies it using JWT_SECRET, and
 * returns the decoded user payload (id, email, name, role).
 *
 * This endpoint is stateless — no database lookup is needed because the
 * user data is embedded in the signed JWT. This makes it work reliably
 * across Vercel's serverless function instances.
 *
 * Used by the frontend to populate the profile menu after page load or
 * refresh, and by the global auth middleware to guard protected routes.
 *
 * On success: { success: true, user: { id, name, email, role } }
 * On failure: 401 if no cookie / token is invalid or expired.
 */
export default defineEventHandler(async (event) => {
  const user = getAuthUser(event);

  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: "Not authenticated.",
      data: { message: "Authentication required. Please log in." },
    });
  }

  return {
    success: true,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
  };
});
