import { getCookie } from "h3";
import bcrypt from "bcryptjs";
import { query } from "~/server/utils/db";

/**
 * PUT /api/auth/profile
 *
 * Updates the current admin's profile (name, email, and optionally password).
 *
 * The request body may contain:
 *   - name:             (string) new display name
 *   - email:            (string) new email address
 *   - new_password:     (string, optional) new password to set
 *
 * The admin is identified by the `auth_token` cookie (admin ID). 
 *
 * On success: { success: true, user: { id, name, email } }
 * On failure: 401 (not authenticated), 400 (validation error).
 */
export default defineEventHandler(async (event) => {
  const token = getCookie(event, "auth_token");

  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: "Not authenticated.",
    });
  }

  const body = await readBody(event);
  const { name, email, new_password } = body;

  // Look up the admin by ID (from the cookie)
  const [rows] = await query(
    "SELECT id, name, email, password_hash FROM admins WHERE id = ? LIMIT 1",
    [token]
  );

  const admin = rows?.[0];

  if (!admin) {
    throw createError({
      statusCode: 401,
      statusMessage: "Admin not found.",
    });
  }

  // Build the update query dynamically based on which fields are provided
  const updates: string[] = [];
  const params: any[] = [];

  if (name !== undefined && name !== null && name !== "") {
    updates.push("name = ?");
    params.push(name);
  }

  if (email !== undefined && email !== null && email !== "") {
    updates.push("email = ?");
    params.push(email);
  }

  if (new_password !== undefined && new_password !== null && new_password !== "") {
    const hashedPassword = await bcrypt.hash(new_password, 10);
    updates.push("password_hash = ?");
    params.push(hashedPassword);
  }

  if (updates.length === 0) {
    throw createError({
      statusCode: 400,
      statusMessage: "No fields to update.",
    });
  }

  // Always update the updated_at timestamp
  updates.push("updated_at = NOW()");

  params.push(admin.id);

  await query(
    `UPDATE admins SET ${updates.join(", ")} WHERE id = ?`,
    params
  );

  // Return the updated profile
  return {
    success: true,
    message: "Profile updated successfully.",
    user: {
      id: admin.id,
      name: name !== undefined && name !== null && name !== "" ? name : admin.name,
      email: email !== undefined && email !== null && email !== "" ? email : admin.email,
    },
  };
});
