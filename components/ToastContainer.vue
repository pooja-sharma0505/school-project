<template>
  <Teleport to="body">
    <div class="fixed top-4 right-4 z-[100] flex w-full max-w-sm flex-col gap-2 pointer-events-none">
      <TransitionGroup
        enter-active-class="transition-all duration-700 ease-out"
        leave-active-class="transition-all duration-300 ease-in"
        enter-from-class="opacity-0 translate-x-16"
        enter-to-class="opacity-100 translate-x-0"
        leave-from-class="opacity-100 translate-x-0"
        leave-to-class="opacity-0 translate-x-16"
      >
        <div
          v-for="toast in toasts"
          :key="toast.id"
          class="pointer-events-auto flex items-start gap-3 px-4 py-3 rounded-xl shadow-lg text-sm font-medium"
          :class="typeClasses[toast.type]"
        >
          <p class="flex-1 leading-snug">{{ toast.message }}</p>
          <button class="shrink-0 opacity-70 hover:opacity-100 transition-opacity" @click="dismiss(toast.id)">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>


<script setup lang="ts">
const { toasts, dismiss } = useToast()

const typeClasses: Record<string, string> = {
  success: 'bg-emerald-600 text-white',
  error: 'bg-red-600 text-white',
  info: 'bg-slate-800 text-white',
}
</script>
