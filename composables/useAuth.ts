/**
 * Authentication composable for the admin panel.
 *
 * Uses a simple cookie-based session:
 *   - `login()`   calls /api/auth/login, which sets an `auth_token` cookie
 *                 containing the admin's database ID
 *   - `logout()`  calls /api/auth/logout, which clears the cookie
 *   - `checkAuth()` syncs the `isAuthenticated` state with the cookie
 *   - `fetchUser()` calls /api/auth/me to load the current admin's profile
 *   - `updateProfile()` calls /api/auth/profile to save profile edits
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
      const response: any = await $fetch("/api/auth/login", {
        method: "POST",
        body: { email, password },
      });

      if (response.success) {
        // The cookie now stores the admin's database ID (set by the server)
        token.value = String(response.user.id);
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

  /**
   * Fetch the current admin's profile from /api/auth/me.
   * Used to populate the profile menu after page load or refresh.
   * Updates the `user` state and `isAuthenticated` flag.
   */
  const fetchUser = async () => {
    if (!token.value) {
      isAuthenticated.value = false;
      user.value = null;
      return null;
    }

    try {
      const response = await $fetch("/api/auth/me", {
        method: "GET",
      });

      if (response.success) {
        user.value = response.user;
        isAuthenticated.value = true;
        return response.user;
      }

      return null;
    } catch (error: any) {
      // If the cookie is invalid/expired, clear state
      token.value = null;
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
