/**
 * Global auth middleware — protects every route except /login.
 *
 * Reads the `auth_token` cookie set by /api/auth/login.
 * If the cookie is absent and the user is not on the login page,
 * redirects to /login.
 */
export default defineNuxtRouteMiddleware((to) => {
  const token = useCookie("auth_token");

  if (!token.value && to.path !== "/login") {
    return navigateTo("/login");
  }
});
