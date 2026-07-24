<script setup lang="ts">
const props = defineProps<{ modelValue: boolean; title?: string; confirmText?: string }>()
const emit = defineEmits<{
  (e: 'update:modelValue', v: boolean): void
  (e: 'confirm'): void
  (e: 'cancel'): void
}>()

const dialogRef = ref<HTMLElement | null>(null)

const close = () => emit('update:modelValue', false)
const onConfirm = () => { emit('confirm'); close() }
const onCancel = () => { emit('cancel'); close() }

// Close on Escape key
const onKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    e.stopPropagation()
    onCancel()
  }
}

// Focus trap: keep focus inside the dialog while open
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

// Manage focus and event listeners when dialog opens/closes
watch(
  () => props.modelValue,
  (open) => {
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
          @click="onCancel"
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
            class="relative bg-white rounded-2xl shadow-xl max-w-sm w-full p-6"
          >
            <div class="flex items-start gap-4">
              <div
                class="w-11 h-11 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center shrink-0"
              >
                <AppIcon
                  name="search"
                  size="md"
                  class="w-6 h-6 text-red-600"
                />
              </div>
              <div class="flex-1 pt-0.5">
                <h3 class="text-base font-bold text-slate-900">
                  {{ title || 'Confirm Action' }}
                </h3>
                <p class="mt-1.5 text-sm text-slate-500 leading-relaxed">
                  <slot />
                </p>
              </div>
            </div>
            <div class="mt-6 flex justify-end gap-3">
              <button class="btn-secondary" @click="onCancel">Cancel</button>
              <button class="btn-danger" @click="onConfirm">
                {{ confirmText || 'Delete' }}
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>