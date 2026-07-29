import bcrypt from "bcryptjs";
import { query } from "~/server/utils/db";
import { requireAuth } from "~/server/utils/auth";

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
 * The admin is identified by the JWT in the `auth_token` cookie (verified
 * via requireAuth). No database lookup is needed to identify the user —
 * the user's id comes from the decoded JWT.
 *
 * On success: { success: true, user: { id, name, email } }
 * On failure: 401 (not authenticated), 400 (validation error).
 */
export default defineEventHandler(async (event) => {
  // Verify the JWT and get the authenticated user
  const user = requireAuth(event);

  const body = await readBody(event);
  const { name, email, new_password } = body;

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

  params.push(user.id);

  await query(
    `UPDATE admins SET ${updates.join(", ")} WHERE id = ?`,
    params
  );

  // Return the updated profile
  return {
    success: true,
    message: "Profile updated successfully.",
    user: {
      id: user.id,
      name: name !== undefined && name !== null && name !== "" ? name : user.name,
      email: email !== undefined && email !== null && email !== "" ? email : user.email,
    },
  };
});
