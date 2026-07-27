<script setup lang="ts">
const props = defineProps<{ modelValue: boolean; title: string }>()
const emit = defineEmits<{ (e: 'update:modelValue', v: boolean): void }>()

const dialogRef = ref<HTMLElement | null>(null)

const close = () => emit('update:modelValue', false)

// Close on Escape key
const onKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    e.stopPropagation()
    close()
  }
}

// Focus trap: keep focus inside the modal while open
const trapFocus = (e: FocusEvent) => {
  if (!dialogRef.value) return
  const focusable = dialogRef.value.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  )
  const first = focusable[0] as HTMLElement
  const last = focusable[focusable.length - 1] as HTMLElement

  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault()
    last?.focus()
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault()
    first?.focus()
  }
}

// Manage focus and event listeners when modal opens/closes
watch(
  () => props.modelValue,
  (open) => {
    if (!process.client) return
    if (open) {
      nextTick(() => {
        const first = dialogRef.value?.querySelector(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        ) as HTMLElement
        first?.focus()
        document.addEventListener('keydown', onKeydown)
        document.addEventListener('focusin', trapFocus)
      })
    } else {
      document.removeEventListener('keydown', onKeydown)
      document.removeEventListener('focusin', trapFocus)
    }
  },
  { immediate: true }
)

// Cleanup on unmount
onUnmounted(() => {
  if (!process.client) return
  document.removeEventListener('keydown', onKeydown)
  document.removeEventListener('focusin', trapFocus)
})
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-200"
      leave-active-class="transition-opacity duration-200"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0"
    >
      <div
        v-if="modelValue"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <div
          class="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
          @click="close"
        />
        <Transition
          enter-active-class="transition-all duration-200 ease-out"
          leave-active-class="transition-all duration-150 ease-in"
          enter-from-class="opacity-0 scale-95"
          leave-to-class="opacity-0 scale-95"
        >
          <div
            v-if="modelValue"
            ref="dialogRef"
            tabindex="-1"
            role="dialog"
            aria-modal="true"
            class="relative bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col"
          >
            <div
              class="flex items-center justify-between px-6 py-4 border-b border-slate-100 shrink-0"
            >
              <h3 class="text-lg font-bold text-slate-900">{{ title }}</h3>
           <button
  class="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
  @click="close"
>
  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
  </svg>
</button>
            </div>
            <div class="flex-1 overflow-y-auto px-6 py-5">
              <slot />
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>