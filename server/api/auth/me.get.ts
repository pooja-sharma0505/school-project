import { getCookie } from "h3";
import { query } from "~/server/utils/db";

/**
 * GET /api/auth/me
 *
 * Reads the `auth_token` cookie (which now stores the admin's database ID),
 * looks up the admin row, and returns their profile data (id, name, email).
 *
 * Used by the frontend to populate the profile menu after page load or refresh.
 *
 * On success: { success: true, user: { id, name, email } }
 * On failure: 401 if no cookie / admin not found.
 */
export default defineEventHandler(async (event) => {
  const token = getCookie(event, "auth_token");

  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: "Not authenticated.",
    });
  }

  // The cookie stores the admin's database ID
  const [rows] = await query(
    "SELECT id, name, email FROM admins WHERE id = ? LIMIT 1",
    [token]
  );

  const admin = rows?.[0];

  if (!admin) {
    throw createError({
      statusCode: 401,
      statusMessage: "Admin not found.",
    });
  }

  return {
    success: true,
    user: {
      id: admin.id,
      name: admin.name,
      email: admin.email,
    },
  };
});
