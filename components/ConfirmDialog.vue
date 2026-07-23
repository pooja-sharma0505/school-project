<script setup lang="ts">
defineProps<{ modelValue: boolean; title?: string; confirmText?: string }>()
const emit = defineEmits<{ (e: 'update:modelValue', v: boolean): void; (e: 'confirm'): void; (e: 'cancel'): void }>()
const close = () => emit('update:modelValue', false)
const onConfirm = () => { emit('confirm'); close() }
const onCancel = () => { emit('cancel'); close() }
</script>

<template>
  <Teleport to="body">
    <Transition enter-active-class="transition-opacity duration-200" leave-active-class="transition-opacity duration-200" enter-from-class="opacity-0" leave-to-class="opacity-0">
      <div v-if="modelValue" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" @click="onCancel" />
        <Transition enter-active-class="transition-all duration-200 ease-out" leave-active-class="transition-all duration-150 ease-in" enter-from-class="opacity-0 scale-95" leave-to-class="opacity-0 scale-95">
          <div v-if="modelValue" class="relative bg-white rounded-2xl shadow-xl max-w-sm w-full p-6">
            <div class="flex items-start gap-4">
              <div class="w-11 h-11 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center shrink-0">
                <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
              </div>
              <div class="flex-1 pt-0.5">
                <h3 class="text-base font-bold text-slate-900">{{ title || 'Confirm Action' }}</h3>
                <p class="mt-1.5 text-sm text-slate-500 leading-relaxed"><slot /></p>
              </div>
            </div>
            <div class="mt-6 flex justify-end gap-3">
              <button class="btn-secondary" @click="onCancel">Cancel</button>
              <button class="btn-danger" @click="onConfirm">{{ confirmText || 'Delete' }}</button>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>
