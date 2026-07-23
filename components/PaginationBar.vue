<script setup lang="ts">
defineProps<{
  page: number
  totalPages: number
  rangeStart: number
  rangeEnd: number
  total: number
}>()

const emit = defineEmits<{ (e: 'update:page', v: number): void }>()
</script>

<template>
  <div v-if="total > 0" class="px-5 py-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
    <p class="text-sm text-slate-500">
      Showing <span class="font-semibold text-slate-700">{{ rangeStart }}–{{ rangeEnd }}</span> of <span class="font-semibold text-slate-700">{{ total }}</span>
    </p>
    <div class="flex items-center gap-2">
      <button class="btn-secondary btn-sm" :disabled="page <= 1" @click="emit('update:page', page - 1)">Previous</button>
      <span class="text-sm text-slate-600 font-medium px-2">{{ page }} / {{ totalPages }}</span>
      <button class="btn-secondary btn-sm" :disabled="page >= totalPages" @click="emit('update:page', page + 1)">Next</button>
    </div>
  </div>
</template>
