<template>
  <Modal
    :model-value="open"
    @update:model-value="show = $event"
    title="Edit Profile"
  >
    <div class="space-y-5">
      <!-- Name -->
      <div>
        <label class="label">Name</label>
        <input
          v-model="form.name"
          type="text"
          class="input"
          placeholder="Jane Doe"
        />
      </div>

      <!-- Email -->
      <div>
        <label class="label">Email</label>
        <input
          v-model="form.email"
          type="email"
          class="input"
          placeholder="jane@scholar.edu"
        />
      </div>

     <!-- New Password (optional) -->
<div>
  <label class="label">New Password <span class="text-slate-400 font-normal">(optional)</span></label>
  <div class="relative">
    <input
      v-model="form.new_password"
      :type="showNewPassword ? 'text' : 'password'"
      class="input pr-10"
      placeholder="&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;"
    />
    <button
      type="button"
      class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
      @click="showNewPassword = !showNewPassword"
    >
      <svg v-if="!showNewPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
      <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a10.025 10.025 0 012.132-3.411m3.712-2.712A9.958 9.958 0 0112 5c4.478 0 8.268 2.943 9.542 7a9.965 9.965 0 01-4.132 5.411M3 3l18 18" />
      </svg>
    </button>
  </div>
  <p class="mt-1.5 text-xs text-slate-500">
    Leave blank to keep your current password.
  </p>
</div>

      <!-- Error message -->
      <div v-if="error" class="p-3.5 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700 flex items-center gap-2">
        <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        {{ error }}
      </div>

      <!-- Action buttons -->
      <div class="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
        <button
          @click="show = false"
          class="btn-secondary btn-sm"
        >
          Cancel
        </button>
        <button
          @click="handleSave"
          class="btn-primary btn-sm"
          :disabled="saving"
        >
          {{ saving ? "Saving..." : "Save Changes" }}
        </button>
      </div>
    </div>
  </Modal>
</template>

<script setup lang="ts">
const showNewPassword = ref(false);
const props = defineProps<{
  open: boolean;
}>();

const emit = defineEmits<{
  (e: "update:open", v: boolean): void;
}>();

// Internal show state synced with the open prop
const show = ref(props.open);

// Keep internal show in sync with the open prop
watch(
  () => props.open,
  (val) => {
    show.value = val;
  }
);

// When internal show changes, emit update:open
watch(show, (val) => {
  emit("update:open", val);
});

const { user, updateProfile } = useAuth();
const { success: addSuccessToast, error: addErrorToast } = useToast();

const saving = ref(false);
const error = ref("");

// Form state - pre-populated with the current user's data
const form = reactive({
  name: "",
  email: "",
  new_password: "",
});

// Watch for the modal opening and pre-fill the form
watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      error.value = "";
      form.name = user.value?.name || "";
      form.email = user.value?.email || "";
      form.new_password = "";
    }
  }
);

const handleSave = async () => {
  error.value = "";
  saving.value = true;

  try {
    const result: any = await updateProfile({
      name: form.name,
      email: form.email,
      new_password: form.new_password || undefined,
    });

    if (result.success) {
      addSuccessToast("Profile updated successfully.");
      show.value = false;
    } else {
      error.value = result.error || "Failed to update profile.";
    }
  } catch {
    error.value = "Something went wrong. Please try again.";
  } finally {
    saving.value = false;
  }
};
</script>
