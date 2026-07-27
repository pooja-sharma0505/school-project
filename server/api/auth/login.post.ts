import { setCookie } from "h3";
import bcrypt from "bcryptjs";
import { query } from "~/server/utils/db"; // adjust this path to match where your db.ts file actually lives

/**
 * Login endpoint — validates admin credentials against the `admins` table
 * in the database and sets an auth cookie.
 *
 * On success: sets an `auth_token` cookie (7-day expiry) containing the admin's
 *   database ID, and returns { success: true, user: { id, email, name } }
 *
 * On failure: throws a 401 error.
 */
export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const email = body.email;
  const password = body.password;

  if (!email || !password) {
    throw createError({
      statusCode: 400,
      statusMessage: "Email and password are required.",
    });
  }

  // Look up the admin by email
  const [rows] = await query(
    "SELECT id, email, password_hash, name FROM admins WHERE email = ? LIMIT 1",
    [email]
  );

  const admin = rows?.[0];

  // If no matching email, fail immediately (don't reveal whether the email exists)
  if (!admin) {
    throw createError({
      statusCode: 401,
      statusMessage: "Invalid email or password.",
    });
  }

  // Compare the submitted password against the stored bcrypt hash
  const isValid = await bcrypt.compare(password, admin.password_hash);

  if (!isValid) {
    throw createError({
      statusCode: 401,
      statusMessage: "Invalid email or password.",
    });
  }

  // Set auth cookie — stores the admin's database ID so the server can look up
  // their profile on subsequent requests (e.g. /api/auth/me).
  // Not httpOnly so the client-side middleware can read it.
  setCookie(event, "auth_token", String(admin.id), {
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
    sameSite: "strict",
  });

  return {
    success: true,
    message: "Login successful",
    user: {
      id: admin.id,
      email: admin.email,
      name: admin.name,
    },
  };
});
