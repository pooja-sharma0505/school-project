import bcrypt from "bcryptjs";
import { query } from "~/server/utils/db";
import { setAuthCookie } from "~/server/utils/auth";

/**
 * Login endpoint — validates admin credentials against the `admins` table
 * in the database and sets a JWT auth cookie.
 *
 * On success: signs a JWT containing { id, email, name, role } using
 *   JWT_SECRET (runtime config), expiring in 7 days, and sets it as an
 *   httpOnly, secure, sameSite cookie on the response.
 *   Returns { success: true, user: { id, email, name, role } }
 *
 * On failure: throws a 401 error.
 *
 * This handler is wrapped in try/catch so that any unexpected error (DB
 * connection failure, missing table, bcrypt error, etc.) is logged with a
 * full stack trace and returned as a structured JSON response instead of
 * an unhandled 500 "Server Error".
 */
export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);

    const email = body.email;
    const password = body.password;

    if (!email || !password) {
      throw createError({
        statusCode: 400,
        statusMessage: "Email and password are required.",
      });
    }

    // ── Look up the admin by email ──
    // NOTE: We intentionally do NOT select the `role` column here.
    // The Supabase migration (20260728000000_create_admins_table.sql) includes
    // a `role` column, but the TiDB Cloud (MySQL) database may not have it
    // if it was provisioned before that migration was applied. Selecting a
    // non-existent column throws "Unknown column 'role' in 'field list'".
    // Instead, we default role to 'admin' in the JWT payload below.
    // To add the column to TiDB Cloud, run:
    //   ALTER TABLE admins ADD COLUMN IF NOT EXISTS role VARCHAR(50) NOT NULL DEFAULT 'admin';
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

    // ── Compare the submitted password against the stored bcrypt hash ──
    const isValid = await bcrypt.compare(password, admin.password_hash);

    if (!isValid) {
      throw createError({
        statusCode: 401,
        statusMessage: "Invalid email or password.",
      });
    }

    // ── Sign a JWT and set it as an httpOnly, secure, sameSite cookie ──
    // The JWT contains the admin's id, email, name, and role.
    // On Vercel's serverless platform, this is stateless — no shared session
    // store is needed, so the cookie persists across function invocations.
    // Role defaults to 'admin' since the column may not exist in TiDB Cloud.
    const user = {
      id: admin.id,
      email: admin.email,
      name: admin.name,
      role: "admin",
    };

    setAuthCookie(event, user);

    return {
      success: true,
      message: "Login successful",
      user,
    };
  } catch (error: any) {
    // Log unexpected failures without including request-specific debug details.
    console.error("LOGIN ERROR — full details:", {
      message: error?.message || String(error),
      code: error?.code || "UNKNOWN",
      statusCode: error?.statusCode || 500,
      stack: error?.stack || new Error().stack,
      // Log the SQL state / errno if present (mysql2 specific)
      sqlState: error?.sqlState,
      errno: error?.errno,
    });

    // If this is already a createError (e.g. 400/401), re-throw as-is
    if (error?.statusCode && error?.statusCode < 500) {
      throw error;
    }

    // For all other (unexpected) errors, return a structured 500 response
    // with the actual error message instead of a generic "Server Error".
    throw createError({
      statusCode: error?.statusCode || 500,
      statusMessage: error?.message || "Internal Server Error",
      data: {
        message: error?.message || "Internal Server Error",
        code: error?.code || "UNKNOWN",
      },
    });
  }
});
