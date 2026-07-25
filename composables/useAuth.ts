/**
 * Authentication composable for the admin panel.
 *
 * Uses a simple cookie-based session:
 *   - `login()`   calls /api/auth/login, which sets an `auth_token` cookie
 *   - `logout()`  calls /api/auth/logout, which clears the cookie
 *   - `checkAuth()` syncs the `isAuthenticated` state with the cookie
 *
 * The middleware (middleware/auth.global.ts) reads the same cookie to
 * protect routes.
 */

export function useAuth() {
  const isAuthenticated = useState("auth.isAuthenticated", () => false);
  const user = useState("auth.user", () => null as null | Record<string, any>);
  const token = useCookie("auth_token");

  /** Sync the isAuthenticated state with the cookie value. */
  const checkAuth = () => {
    isAuthenticated.value = !!token.value;
  };

  /**
   * Log in with email + password.
   * Returns the API response (success or error).
   */
  const login = async (email: string, password: string) => {
    try {
      const response = await $fetch("/api/auth/login", {
        method: "POST",
        body: { email, password },
      });

      if (response.success) {
        token.value = "authenticated";
        isAuthenticated.value = true;
        user.value = response.user;
      }

      return response;
    } catch (error: any) {
      return {
        success: false,
        error: error.data?.message || "Login failed",
      };
    }
  };

  /** Log out — clears the cookie and resets state. */
  const logout = async () => {
    try {
      await $fetch("/api/auth/logout", { method: "POST" });
    } catch {
      // Ignore errors — we clear the cookie regardless
    }
    token.value = null;
    isAuthenticated.value = false;
    user.value = null;
  };

  return { isAuthenticated, user, login, logout, checkAuth };
}
