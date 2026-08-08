<template>
  <div class="min-h-screen flex items-center justify-center bg-slate-50">
    <div class="w-full max-w-md">
      <div class="bg-white rounded-2xl shadow-xl p-8">
        <!-- Logo / Brand -->
        <div class="text-center mb-8">
          <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center font-bold text-white text-2xl mx-auto mb-4 shadow-lg">
            S
          </div>
          <h1 class="text-2xl font-bold text-slate-900">Scholar MS</h1>
          <p class="text-slate-500 mt-1">Admin Login</p>
        </div>

        <!-- Login Form -->
        <form @submit.prevent="handleLogin">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-semibold text-slate-700 mb-1.5">Email</label>
              <input
                v-model="email"
                type="email"
                class="input"
                placeholder="admin@scholar.edu"
                required
              >
            </div>

            <div>
              <label class="block text-sm font-semibold text-slate-700 mb-1.5">Password</label>
              <input
                v-model="password"
                type="password"
                class="input"
                placeholder="••••••••"
                required
              >
            </div>
          </div>

          <!-- Error Message -->
          <div v-if="error" class="mt-4 p-3.5 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700 flex items-center gap-2">
            <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            {{ error }}
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            class="btn-primary w-full mt-6"
            :disabled="loading"
          >
            {{ loading ? "Signing in..." : "Sign In" }}
          </button>
        </form>

      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ layout: false })

const email = ref("");
const password = ref("");
const error = ref("");
const loading = ref(false);

const { login } = useAuth();

const handleLogin = async () => {
  error.value = "";
  loading.value = true;

  try {
    const result = await login(email.value, password.value);

    if (result.success) {
      // Await navigateTo to ensure the redirect happens after auth state
      // is fully settled. Without await, the redirect can fire before
      // the client-side auth state is synced, causing a flash of the
      // login page or a redirect loop.
      await navigateTo("/");
    } else {
      error.value = result.error || "Invalid email or password.";
    }
  } catch {
    error.value = "Something went wrong. Please try again.";
  } finally {
    loading.value = false;
  }
};
</script>
