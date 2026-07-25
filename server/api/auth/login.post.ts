import { setCookie } from "h3";

/**
 * Login endpoint — validates admin credentials and sets an auth cookie.
 *
 * Credentials are read from runtime config (private, not exposed to client):
 *   - adminEmail    (default: admin@scholar.edu)
 *   - adminPassword (default: admin123)
 *
 * On success: sets an `auth_token` cookie (7-day expiry) and returns
 *   { success: true, user: { email, name } }
 *
 * On failure: throws a 401 error.
 */
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const body = await readBody(event);

  const email = body.email;
  const password = body.password;

  if (!email || !password) {
    throw createError({
      statusCode: 400,
      statusMessage: "Email and password are required.",
    });
  }

  const isValid =
    email === config.adminEmail && password === config.adminPassword;

  if (!isValid) {
    throw createError({
      statusCode: 401,
      statusMessage: "Invalid email or password.",
    });
  }

  // Set auth cookie — not httpOnly so the client-side middleware can read it
  setCookie(event, "auth_token", "authenticated", {
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
    sameSite: "strict",
  });

  return {
    success: true,
    message: "Login successful",
    user: {
      email: email,
      name: "Administrator",
    },
  };
});
