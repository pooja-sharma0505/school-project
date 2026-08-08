/**
 * Global auth middleware — protects every route except /login.
 *
 * With JWT + httpOnly cookies, the cookie is NOT readable from JavaScript
 * (httpOnly prevents document.cookie access). So instead of checking the
 * cookie directly, we call /api/auth/me (via useAuth().fetchUser()) to
 * verify the JWT server-side.
 *
 * On the initial page load (SSR), the middleware runs on the server.
 * fetchUser() must forward the incoming cookie header to /api/auth/me so
 * the server can verify the existing JWT and return the user.
 *
 * On subsequent client-side navigations, the auth state is already cached
 * in useAuth().isAuthenticated, so no extra API call is needed.
 *
 * If the user is not authenticated and not on /login, redirect to /login.
 *
 * Retry logic: fetchUser() is retried up to 2 times with a short delay
 * to handle transient DB connection failures on Vercel's serverless
 * platform. This prevents users from being bounced to /login when the
 * DB connection is temporarily unavailable.
 */
export default defineNuxtRouteMiddleware(async (to) => {
  // Always allow access to the login page
  if (to.path === "/login") return;

  const { isAuthenticated, fetchUser } = useAuth();

  // If not yet authenticated, try to fetch the user from /api/auth/me.
  // This verifies the JWT cookie server-side.
  if (!isAuthenticated.value) {
    // Retry up to 2 times to handle transient DB connection failures.
    // On Vercel serverless, cold starts can cause brief DB connection
    // issues — retrying gives the connection pool time to establish.
    let user = null;
    const maxRetries = 2;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      user = await fetchUser();

      if (user) {
        break;
      }

      // If not the last attempt, wait briefly before retrying.
      if (attempt < maxRetries) {
        await new Promise((resolve) => setTimeout(resolve, 300 * (attempt + 1)));
      }
    }

    if (!user) {
      return navigateTo("/login");
    }
  }
});
