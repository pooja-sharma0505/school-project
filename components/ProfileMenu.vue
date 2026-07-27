<template>
  <div class="relative inline-block text-left" ref="containerRef">
    <!-- Trigger button: avatar + name + chevron -->
    <button
      @click="open = !open"
      @keydown.space.prevent="open = !open"
      @keydown.enter.prevent="open = !open"
      @keydown.escape="open = false"
      class="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
    >
      <!-- Avatar circle with initials -->
      <div
        class="w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm text-white shrink-0"
        :class="avatarColor"
      >
        {{ initials }}
      </div>

      <!-- Name (hidden on very small screens) -->
      <span class="hidden sm:block text-sm font-semibold text-slate-700 truncate max-w-[120px]">
        {{ displayName }}
      </span>

      <!-- Dropdown arrow -->
      <AppIcon
        name="chevron-down"
        size="sm"
        class="w-4 h-4 text-slate-400 transition-transform duration-150"
        :class="{ 'rotate-180': open }"
      />
    </button>

    <!-- Dropdown menu -->
    <Transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <div
        v-if="open"
        class="absolute right-0 mt-2 w-48 origin-top-right rounded-xl bg-white border border-slate-200 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
      >
        <div class="py-1">
          <!-- Edit Profile -->
          <button
            @click="openEditProfile"
            class="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors"
          >
           
            Edit Profile
          </button>

          <!-- Divider -->
          <div class="border-t border-slate-100 my-1"></div>

          <!-- Logout -->
          <button
            @click="handleLogout"
            class="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
            Logout
          </button>
        </div>
      </div>
    </Transition>

    <!-- Edit Profile Modal -->
    <EditProfileModal v-model:open="showEditProfile" />
  </div>
</template>

<script setup lang="ts">
const { user, logout } = useAuth();
const { info: addToast } = useToast();

const open = ref(false);
const showEditProfile = ref(false);
const containerRef = ref<HTMLElement | null>(null);

// Compute initials from the user's name
const initials = computed(() => {
  const name = user.value?.name || "";
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
});

// Display name with fallback
const displayName = computed(() => {
  return user.value?.name || user.value?.email || "Admin";
});

// Pick a consistent avatar color based on the user's name
const avatarColors = [
  "bg-gradient-to-br from-blue-500 to-blue-700",
  "bg-gradient-to-br from-emerald-500 to-emerald-700",
  "bg-gradient-to-br from-purple-500 to-purple-700",
  "bg-gradient-to-br from-rose-500 to-rose-700",
  "bg-gradient-to-br from-amber-500 to-amber-700",
  "bg-gradient-to-br from-cyan-500 to-cyan-700",
  "bg-gradient-to-br from-indigo-500 to-indigo-700",
];

const avatarColor = computed(() => {
  const name = user.value?.name || "Admin";
  const index = name.charCodeAt(0) % avatarColors.length;
  return avatarColors[index];
});

// Close dropdown when clicking outside
const handleOutsideClick = (e: MouseEvent) => {
  if (containerRef.value && !containerRef.value.contains(e.target as Node)) {
    open.value = false;
  }
};

// Close dropdown on Escape key
const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === "Escape") {
    open.value = false;
    showEditProfile.value = false;
  }
};

onMounted(() => {
  document.addEventListener("click", handleOutsideClick);
  document.addEventListener("keydown", handleKeydown);
});

onUnmounted(() => {
  document.removeEventListener("click", handleOutsideClick);
  document.removeEventListener("keydown", handleKeydown);
});

// Open the Edit Profile modal and close the dropdown
const openEditProfile = () => {
  open.value = false;
  showEditProfile.value = true;
};

// Handle logout
const handleLogout = async () => {
  open.value = false;
  await logout();
  addToast("You have been logged out.");
  navigateTo("/login");
};
</script>
