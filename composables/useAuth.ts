/**
 * Authentication composable for the admin panel.
 *
 * Uses JWT-based auth with an httpOnly cookie:
 *   - `login()`    calls /api/auth/login, which signs a JWT and sets it
 *                  as an httpOnly, secure, sameSite cookie on the response.
 *                  The cookie is NOT readable by JavaScript (httpOnly),
 *                  so auth state is synced via /api/auth/me.
 *   - `logout()`   calls /api/auth/logout, which clears the cookie.
 *   - `fetchUser()` calls /api/auth/me to load the current admin's profile
 *                  (the server verifies the JWT from the cookie).
 *   - `updateProfile()` calls /api/auth/profile to save profile edits.
 *
 * The global middleware (middleware/auth.global.ts) calls fetchUser()
 * to guard protected routes.
 */

export function useAuth() {
  const isAuthenticated = useState("auth.isAuthenticated", () => false);
  const user = useState("auth.user", () => null as null | Record<string, any>);

  /**
   * Sync the isAuthenticated state with the server.
   *
   * With JWT + httpOnly cookies, we can't read the cookie from the client
   * (httpOnly prevents JavaScript access). Instead, we call /api/auth/me
   * to verify the JWT server-side.
   *
   * This is a no-op now — use fetchUser() to sync auth state.
   */
  const checkAuth = () => {
    // Auth state is determined by fetchUser() calling /api/auth/me.
    // This method is kept for backward compatibility.
  };

  /**
   * Log in with email + password.
   *
   * On success, the server sets an httpOnly JWT cookie. We then call
   * fetchUser() to populate the client-side auth state from /api/auth/me,
   * ensuring the client state is always in sync with the server-side
   * JWT verification (not just the login response).
   *
   * @returns The API response (success or error).
   */
  const login = async (email: string, password: string) => {
    try {
      const response: any = await $fetch("/api/auth/login", {
        method: "POST",
        body: { email, password },
      });

      if (response.success) {
        // The server has set the httpOnly JWT cookie.
        // Sync client-side state by fetching the user profile from /api/auth/me.
        // This ensures the client state is verified against the server-side
        // JWT, not just trusted from the login response.
        await fetchUser();
      }

      return response;
    } catch (error: any) {
      return {
        success: false,
        error: error.data?.message || "Login failed",
      };
    }
  };

  /**
   * Fetch the current admin's profile from /api/auth/me.
   *
   * The server reads and verifies the JWT from the httpOnly cookie,
   * so this works reliably across Vercel's serverless instances.
   *
   * Updates the `user` state and `isAuthenticated` flag.
   *
   * @returns The user object on success, or null if not authenticated.
   */
  const fetchUser = async () => {
    try {
      // On the server, internal $fetch calls do not automatically forward
      // the incoming browser cookies. Pass the cookie header through so
      // /api/auth/me can verify the existing auth_token during SSR.
      const headers = import.meta.server ? useRequestHeaders(["cookie"]) : undefined;

      const response = await $fetch("/api/auth/me", {
        method: "GET",
        headers,
      });

      if (response.success) {
        user.value = response.user;
        isAuthenticated.value = true;
        return response.user;
      }

      return null;
    } catch (error: any) {
      // If the cookie is invalid/expired, clear state
      isAuthenticated.value = false;
      user.value = null;
      return null;
    }
  };

  /**
   * Update the current admin's profile.
   *
   * @param data - { name, email, new_password }
   *   - name:             new display name
   *   - email:            new email address
   *   - new_password:     optional new password
   * @returns The API response (success or error).
   */
  const updateProfile = async (data: {
    name?: string;
    email?: string;
    new_password?: string;
  }) => {
    try {
      const response = await $fetch("/api/auth/profile", {
        method: "PUT",
        body: data,
      });

      if (response.success) {
        user.value = response.user;
      }

      return response;
    } catch (error: any) {
      return {
        success: false,
        error: error.data?.message || "Failed to update profile",
      };
    }
  };

  /**
   * Log out — clears the cookie (server-side) and resets client state.
   */
  const logout = async () => {
    try {
      await $fetch("/api/auth/logout", { method: "POST" });
    } catch {
      // Ignore errors — we clear the state regardless
    }
    isAuthenticated.value = false;
    user.value = null;
  };

  return {
    isAuthenticated,
    user,
    login,
    logout,
    checkAuth,
    fetchUser,
    updateProfile,
  };
}
