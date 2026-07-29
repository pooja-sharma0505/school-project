/**
 * Global auth middleware — protects every route except /login.
 *
 * With JWT + httpOnly cookies, the cookie is NOT readable from JavaScript
 * (httpOnly prevents document.cookie access). So instead of checking the
 * cookie directly, we call /api/auth/me (via useAuth().fetchUser()) to
 * verify the JWT server-side.
 *
 * On the initial page load (SSR), the middleware runs on the server and
 * the httpOnly cookie is sent automatically by the browser. The /api/auth/me
 * call verifies the JWT and returns the user.
 *
 * On subsequent client-side navigations, the auth state is already cached
 * in useAuth().isAuthenticated, so no extra API call is needed.
 *
 * If the user is not authenticated and not on /login, redirect to /login.
 */
export default defineNuxtRouteMiddleware(async (to) => {
  // Always allow access to the login page
  if (to.path === "/login") return;

  const { isAuthenticated, fetchUser } = useAuth();

  // If not yet authenticated, try to fetch the user from /api/auth/me.
  // This verifies the JWT cookie server-side.
  if (!isAuthenticated.value) {
    const user = await fetchUser();

    if (!user) {
      return navigateTo("/login");
    }
  }
});
