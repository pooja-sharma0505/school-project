<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-xl font-bold text-slate-900">Exam Management</h1>
        <p class="text-sm text-slate-500 mt-0.5">Schedule and manage examinations</p>
      </div>
      <button class="btn-primary" @click="openAdd">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4"/>
        </svg>Add Exam</button>
    </div>

    <!-- Status overview / filter chips -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
      <button v-for="key in ['today', 'upcoming', 'completed', 'unscheduled']" :key="key"
        class="bg-white rounded-2xl border shadow-sm p-4 text-left transition-all"
        :class="statusFilter === key ? 'border-slate-900 ring-1 ring-slate-900' : 'border-slate-200 hover:border-slate-300'"
        @click="toggleStatusFilter(key)">
        <div class="flex items-center gap-2">
          <span class="w-2.5 h-2.5 rounded-full" :class="statusCfg[key].bar">

          </span>
          <span class="text-sm font-medium text-slate-600">{{ statusCfg[key].label }}</span>
        </div>
        <p class="text-2xl font-bold text-slate-900 mt-1.5">{{ stats[key] }}</p>
      </button>
    </div>

    <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
      <div class="relative">
        <svg class="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
        </svg>
        <input v-model="search" type="text" placeholder="Search exams by name, subject, or term..." class="input pl-10">
      </div>
    </div>

    <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div v-for="i in 3" :key="i" class="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
        <div class="flex items-start justify-between mb-4">
          <div class="w-11 h-11 rounded-xl bg-slate-200 animate-pulse">

          </div>
          <div class="h-6 w-20 rounded-full bg-slate-200 animate-pulse">

          </div>
        </div>
        <div class="h-4 w-32 bg-slate-200 rounded animate-pulse mb-4">

        </div>
        <div class="space-y-2">
          <div class="h-3 w-full bg-slate-200 rounded animate-pulse">

        </div>
        <div class="h-3 w-full bg-slate-200 rounded animate-pulse">

        </div>
        <div class="h-3 w-2/3 bg-slate-200 rounded animate-pulse">

        </div>
      </div>
      </div>
    </div>

    <div v-else-if="filtered.length === 0" class="bg-white rounded-2xl border border-slate-200 shadow-sm">
      <EmptyState :message="search || statusFilter ? 'No exams match your filters.' : 'No exams found. Schedule your first exam to get started.'">
        <template #action>
          <button class="btn-primary" @click="openAdd">Add Exam</button>
        </template>
      </EmptyState>
    </div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div v-for="e in filtered" :key="e.id" class="relative bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden transition-all hover:shadow-md hover:-translate-y-0.5">
        <div class="absolute top-0 left-0 right-0 h-1" :class="statusCfg[examStatus(e)].bar">

        </div>
        <div class="p-5">
          <div class="flex items-start justify-between mb-4">
            <div class="w-11 h-11 rounded-xl bg-gradient-to-br flex items-center justify-center shadow-sm" :class="statusCfg[examStatus(e)].bg">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
              </svg>
            </div>

            
            <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold" :class="statusCfg[examStatus(e)].badge">
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" :d="statusCfg[examStatus(e)].icon"/>
              </svg>
              {{ statusCfg[examStatus(e)].label }}
            </span>

          </div>

          <h3 class="font-bold text-slate-900 text-base">{{ e.name }}</h3>
          <div class="mt-4 space-y-2 text-sm">
            <div class="flex justify-between">
              <span class="text-slate-500">Subject</span>
              <span class="text-slate-700 font-medium">{{ e.subject || '—' }}

              </span>
            </div>


            <div class="flex justify-between">
              <span class="text-slate-500">Class</span>
              <span class="text-slate-700 font-medium">{{ e.class || 'All' }}</span>
            </div>


            <div class="flex justify-between">
              <span class="text-slate-500">Term</span>
              <span class="text-slate-700 font-medium">{{ e.term || '—' }}</span>
            </div>


            <div class="flex justify-between">
              <span class="text-slate-500">Date</span>
              <span class="text-slate-700 font-medium">{{ formatDate(e.exam_date) }}</span>
            </div>


            <div class="flex justify-between pt-2 mt-2 border-t border-slate-100">
              <span class="text-slate-500">Marks</span>
              <span class="text-slate-700 font-semibold">Max {{ e.max_marks }} · Pass {{ e.pass_marks }}</span>
            </div>
          </div>


          <div class="mt-5 flex items-center justify-between pt-4 border-t border-slate-100">
            <NuxtLink :to="`/results?exam=${e.id}`" class="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors">View Results<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
          </NuxtLink>

            <div class="flex gap-1">
              <ActionIconButton icon="edit" label="Edit exam" @click="openEdit(e)" />
              <ActionIconButton icon="delete" label="Delete exam" @click="confirmDelete(e)" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Form Modal -->
    <Modal v-model="showForm" :title="editingExam ? 'Edit Exam' : 'Add New Exam'">
      <div class="space-y-4">
        <div v-if="formError" class="p-3.5 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700 flex items-center gap-2">
          <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
          </svg>{{ formError }}</div>

        <div>
          <label class="block text-sm font-semibold text-slate-700 mb-1.5">Exam Name <span class="text-red-500">*</span>
          </label>
          <input v-model="form.name" class="input" placeholder="e.g. Midterm Mathematics">
        </div>


        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1.5">Term</label>
            <input v-model="form.term" class="input" placeholder="First Term">
          </div>


          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1.5">Subject</label>
            <input v-model="form.subject" class="input" placeholder="Mathematics">
          </div>
        </div>


        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1.5">Class</label>
            <input v-model="form.class" class="input" placeholder="Grade 10">
          </div>
          <div>


            <label class="block text-sm font-semibold text-slate-700 mb-1.5">Exam Date</label>
            <input v-model="form.exam_date" type="date" class="input">
          </div>
        </div>


        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1.5">Max Marks</label>
            <input v-model="form.max_marks" type="number" class="input">
          </div>


          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1.5">Pass Marks</label>
            <input v-model="form.pass_marks" type="number" class="input">
          </div>
        </div>


        <div>
          <label class="block text-sm font-semibold text-slate-700 mb-1.5">Note</label>
          <textarea v-model="form.note" class="input" rows="2"></textarea>
        </div>
        <div class="flex justify-end gap-3 pt-4 border-t border-slate-100 -mx-6 px-6 -mb-5 pb-5 mt-6">
          <button class="btn-secondary" @click="showForm = false">Cancel</button>
          <button class="btn-primary" :disabled="saving" @click="saveExam">{{ saving ? 'Saving...' : (editingExam ? 'Update Exam' : 'Add Exam') }}</button>
        </div>
      </div>
    </Modal>

    <ConfirmDialog v-model="showDelete" @confirm="doDelete">Delete “{{ deletingExam?.name }}”? All associated results will also be removed.</ConfirmDialog>


  </div>
</template>


<script setup>
const toast = useToast()
const exams = ref([])
const loading = ref(true)
const saving = ref(false)

const search = ref("")
const statusFilter = ref("")

const showForm = ref(false)
const showDelete = ref(false)

const editingExam = ref(null)
const deletingExam = ref(null)

const formError = ref("")

const form = ref({
  name: "",
  term: "",
  class: "",
  subject: "",
  exam_date: "",
  max_marks: "100",
  pass_marks: "33",
  note: ""
})

const examStatus = (exam) => {
  if (!exam.exam_date) return "unscheduled"

  const today = new Date().toISOString().split("T")[0]

  if (exam.exam_date < today) return "completed"
  if (exam.exam_date === today) return "today"

  return "upcoming"
}

const statusCfg = {
  today: {
    badge: "bg-amber-50 text-amber-700",
    bg: "from-amber-500 to-amber-600",
    bar: "bg-amber-500",
    label: "Today",
    icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
  },

  upcoming: {
    badge: "bg-blue-50 text-blue-700",
    bg: "from-blue-500 to-blue-600",
    bar: "bg-blue-500",
    label: "Upcoming",
    icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
  },

  completed: {
    badge: "bg-slate-100 text-slate-600",
    bg: "from-slate-400 to-slate-500",
    bar: "bg-slate-400",
    label: "Completed",
    icon: "M5 13l4 4L19 7"
  },

  unscheduled: {
    badge: "bg-red-50 text-red-700",
    bg: "from-red-400 to-red-500",
    bar: "bg-red-400",
    label: "Unscheduled",
    icon: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
  }
}

const stats = computed(() => {
  const count = {
    today: 0,
    upcoming: 0,
    completed: 0,
    unscheduled: 0
  }

  exams.value.forEach((exam) => {
    count[examStatus(exam)]++
  })

  return count
})

const filtered = computed(() => {
  const keyword = search.value.toLowerCase()

  return exams.value.filter((exam) => {
    const matchesSearch =
      !keyword ||
      exam.name.toLowerCase().includes(keyword) ||
      (exam.subject || "").toLowerCase().includes(keyword) ||
      (exam.term || "").toLowerCase().includes(keyword)

    const matchesStatus =
      !statusFilter.value ||
      examStatus(exam) === statusFilter.value

    return matchesSearch && matchesStatus
  })
})

const toggleStatusFilter = (status) => {
  if (statusFilter.value === status) {
    statusFilter.value = ""
  } else {
    statusFilter.value = status
  }
}

const resetForm = () => {
  form.value = {
    name: "",
    term: "",
    class: "",
    subject: "",
    exam_date: "",
    max_marks: "100",
    pass_marks: "33",
    note: ""
  }

  editingExam.value = null
  formError.value = ""
}

const openAdd = () => {
  resetForm()
  showForm.value = true
}

const openEdit = (exam) => {
  editingExam.value = exam

  form.value = {
    name: exam.name,
    term: exam.term || "",
    class: exam.class || "",
    subject: exam.subject || "",
    exam_date: exam.exam_date || "",
    max_marks: String(exam.max_marks),
    pass_marks: String(exam.pass_marks),
    note: exam.note || ""
  }

  formError.value = ""
  showForm.value = true
}
const saveExam = async () => {
  formError.value = ""

  if (!form.value.name.trim()) {
  formError.value = "Exam name is required"
toast.error("Exam name is required")
return
  }

  const max = Number(form.value.max_marks) || 100
  const pass = Number(form.value.pass_marks) || 33

  if (pass > max) {
 formError.value = "Pass marks cannot exceed max marks"
toast.error("Pass marks cannot exceed max marks")
return
  }

  saving.value = true

  try {
    const payload = {
      name: form.value.name,
      term: form.value.term || null,
      class: form.value.class || null,
      subject: form.value.subject || null,
      exam_date: form.value.exam_date || null,
      max_marks: max,
      pass_marks: pass,
      note: form.value.note || null
    }

    if (editingExam.value) {
      await $fetch(`/api/exams/${editingExam.value.id}`, {
        method: "PUT",
        body: payload
      })
    } else {
      await $fetch("/api/exams", {
        method: "POST",
        body: payload
      })
    }

  const isEdit = !!editingExam.value

showForm.value = false
resetForm()

await refresh()

if (isEdit) {
  toast.success("Exam updated successfully.")
} else {
  toast.success("Exam added successfully.")
}

  } catch (error) {
    console.error("Save Error:", error)
    formError.value = "Failed to save exam."
toast.error("Failed to save exam.")
  } finally {
    saving.value = false
  }
}

const confirmDelete = (exam) => {
  deletingExam.value = exam
  showDelete.value = true
}

const doDelete = async () => {
  if (!deletingExam.value) return

  try {
  await $fetch(`/api/exams/${deletingExam.value.id}`, {
  method: "DELETE"
})

deletingExam.value = null
showDelete.value = false

await refresh()

toast.success("Exam deleted successfully.")

  } catch (error) {
  console.error("Delete Error:", error)
  toast.error("Failed to delete exam.")
}
}

const formatDate = (date) => {
  if (!date) return "—"

  return new Date(date + "T00:00").toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  })
}

const fetchExams = async () => {
  loading.value = true

  try {
    exams.value = await $fetch("/api/exams")
  }catch (error) {
  console.error("Fetch Error:", error)
  exams.value = []
  toast.error("Failed to load exams.")
}
   finally {
    loading.value = false
  }
}

// OPTIMISATION: Replaced onMounted + $fetch with useAsyncData for SSR
const { data: examsAsync, pending: loadingAsync, refresh: refreshExams } = await useAsyncData(
  'exams',
  () => $fetch('/api/exams'),
  { server: true, lazy: false }
)

if (examsAsync.value) {
  exams.value = examsAsync.value
  loading.value = false
}

const refresh = async () => {
  await refreshExams()
  if (examsAsync.value) exams.value = examsAsync.value
}
</script>
