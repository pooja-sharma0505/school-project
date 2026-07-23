export function usePagination<T>(items: Ref<T[]>, pageSize = 10) {
  const page = ref(1)

  const totalPages = computed(() => Math.max(1, Math.ceil(items.value.length / pageSize)))

  const paginated = computed(() => {
    const start = (page.value - 1) * pageSize
    return items.value.slice(start, start + pageSize)
  })

  const rangeStart = computed(() => items.value.length === 0 ? 0 : (page.value - 1) * pageSize + 1)
  const rangeEnd = computed(() => Math.min(page.value * pageSize, items.value.length))

  watch(items, () => {
    if (page.value > totalPages.value) page.value = totalPages.value
  })

  const goTo = (p: number) => {
    page.value = Math.min(Math.max(1, p), totalPages.value)
  }

  return { page, pageSize, totalPages, paginated, rangeStart, rangeEnd, goTo }
}
