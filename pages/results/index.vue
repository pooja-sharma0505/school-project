<template>
  <div class="space-y-6">

    <div>
      <h1 class="text-xl font-bold text-slate-900">Results Management</h1>
      <p class="text-sm text-slate-500 mt-0.5">Enter and view exam results</p>
    </div>

    <!-- Exam selector -->
    <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div><label class="block text-sm font-semibold text-slate-700 mb-1.5">Select Exam</label>
          <select v-model="selectedExamId" class="input"><option value="">Choose an exam...</option>
            <option v-for="e in exams" :key="e.id" :value="e.id">{{ e.name }} — {{ e.subject || 'General' }} ({{ formatDate(e.exam_date) }})</option>
          </select>
        </div>


        <div v-if="selectedExam"><label class="block text-sm font-semibold text-slate-700 mb-1.5">Search Student</label>
          <div class="relative"><svg class="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
            <input v-model="search" type="text" placeholder="Search student..." class="input pl-10">
          </div>
        </div>
      </div>
    </div>

    <div v-if="!selectedExamId" class="bg-white rounded-2xl border border-slate-200 shadow-sm">
      <EmptyState message="Select an exam to enter or view results."><template #action><NuxtLink to="/exams" class="btn-primary">Go to Exams</NuxtLink></template></EmptyState>
    </div>

    <template v-else>

      <!-- Stats -->
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
          <p class="text-sm font-medium text-slate-500">Selected Exam</p>
          <h3 class="font-bold text-slate-900 mt-1.5 text-base">{{ selectedExam.name }}</h3>

          <div class="mt-4 space-y-2 text-sm">
            <div class="flex justify-between"><span class="text-slate-500">Max Marks</span><span class="font-semibold text-slate-700">{{ selectedExam.max_marks }}</span>
            </div>
            
            <div class="flex justify-between"><span class="text-slate-500">Pass Marks</span><span class="font-semibold text-slate-700">{{ selectedExam.pass_marks }}</span>
            </div>

            <div class="flex justify-between"><span class="text-slate-500">Subject</span><span class="font-semibold text-slate-700">{{ selectedExam.subject || '—' }}</span>
            </div>

            <div class="flex justify-between"><span class="text-slate-500">Class</span><span class="font-semibold text-slate-700">{{ selectedExam.class || 'All' }}</span>
            </div>
          </div>
        </div>


        <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
          <p class="text-sm font-medium text-slate-500">Results Entered</p>
          <p class="text-3xl font-bold text-slate-900 mt-1.5">{{ stats.entered }}</p>
          <p class="text-xs text-slate-400 mt-1.5">out of {{ filteredStudents.length }}</p>
        </div>

        <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 relative overflow-hidden">
          <div class="absolute top-0 right-0 w-24 h-24 rounded-full -mr-8 -mt-8" :class="stats.passRate >= 50 ? 'bg-emerald-500/5' : 'bg-red-500/5'">
            
          </div>

          <div class="relative"><p class="text-sm font-medium text-slate-500">Pass Rate</p>
            <p class="text-3xl font-bold mt-1.5" :class="stats.passRate >= 50 ? 'text-emerald-700' : 'text-red-700'">{{ stats.passRate.toFixed(0) }}%</p>
            <p class="text-xs text-slate-400 mt-1.5">{{ stats.passed }} passed · {{ stats.failed }} failed</p>
          </div>
        </div>


        <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
          <p class="text-sm font-medium text-slate-500">Average Score</p><p class="text-3xl font-bold text-blue-700 mt-1.5">{{ stats.avg.toFixed(1) }}</p>
          <p class="text-xs text-slate-400 mt-1.5">out of {{ selectedExam.max_marks }}</p>
        </div>
      </div>

      <!-- Marks entry -->
      <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div v-if="loading" class="p-6 space-y-4">
          <div v-for="i in 5" :key="i" class="flex items-center gap-4">
            <div class="w-8 h-8 rounded-full bg-slate-200 animate-pulse"></div><div class="flex-1 h-3 w-32 bg-slate-200 rounded animate-pulse"></div><div class="h-8 w-20 bg-slate-200 rounded-lg animate-pulse">

            </div>
            <div class="h-6 w-16 rounded-full bg-slate-200 animate-pulse"></div>
          </div>
        </div>


        <div v-else-if="searchedStudents.length === 0"><EmptyState message="No students found for this exam." />
        </div>


        <div v-else>
          <div class="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <p class="text-sm font-semibold text-slate-600">Enter marks for each student</p>
            <div class="flex items-center gap-3">
              <span v-if="justSaved" class="text-sm font-medium text-emerald-600 flex items-center gap-1.5">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>
                Saved
              </span>


              <button class="btn-primary btn-sm" :disabled="saving" @click="saveResults"><svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>{{ saving ? 'Saving...' : 'Save Results' }}</button>
            </div>
          </div>

          <!-- Desktop table -->
          <div class="hidden md:block overflow-x-auto">
            <table class="w-full text-sm">
              <thead>
                <tr class="bg-slate-50 border-b border-slate-200">
                  <th class="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Student</th>
                  <th class="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Roll No</th>
                  <th class="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider w-32">Marks</th>
                  <th class="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider w-24">Grade</th>
                  <th class="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider w-20">Status</th>
                  <th class="px-5 py-3.5 w-12"></th>
                </tr>
              </thead>


              <tbody class="divide-y divide-slate-100">
                <tr v-for="s in searchedStudents" :key="s.id" class="hover:bg-slate-50 transition-colors">
                  <td class="px-5 py-3.5">
                    <div class="flex items-center gap-3">
                      <div class="w-8 h-8 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 text-blue-700 flex items-center justify-center font-semibold text-xs shrink-0">{{ initials(s) }}</div>
                      <span class="font-semibold text-slate-900">{{ s.first_name }} {{ s.last_name }}</span>
                    </div>
                  </td>

                  <td class="px-5 py-3.5 font-mono text-xs text-slate-600">{{ s.roll_number || '—' }}</td>
                  <td class="px-5 py-3.5"><input :value="getMark(s.id)" @input="onMarkInput(s.id, $event.target.value)" type="number" :max="selectedExam.max_marks" :min="0" step="0.5" class="input py-1.5 text-sm w-24" :placeholder="`/${selectedExam.max_marks}`"></td>

                  <td class="px-5 py-3.5">
                    <span v-if="getMark(s.id) !== '' && getMark(s.id) !== undefined" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold" :class="gradeColor(computeGrade(parseFloat(getMark(s.id)) || 0, selectedExam.max_marks))">{{ computeGrade(parseFloat(getMark(s.id)) || 0, selectedExam.max_marks) }}</span>
                    <span v-else class="text-slate-300">—</span>
                  </td>


                  <td class="px-5 py-3.5">
                    <span v-if="getMark(s.id) !== '' && getMark(s.id) !== undefined" class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold" :class="parseFloat(getMark(s.id)) >= selectedExam.pass_marks ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'"><span class="w-1.5 h-1.5 rounded-full" :class="parseFloat(getMark(s.id)) >= selectedExam.pass_marks ? 'bg-emerald-500' : 
                    'bg-red-500'"></span>{{ parseFloat(getMark(s.id)) >= selectedExam.pass_marks ? 'Pass' : 'Fail' }}</span>
                    <span v-else class="text-slate-300">—</span>
                  </td>

                  <td class="px-5 py-3.5">
                    <ActionIconButton
                      v-if="existingResults[s.id]"
                      icon="delete"
                      label="Delete result"
                      @click="openDelete(existingResults[s.id])"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Mobile stacked cards -->
          <div class="md:hidden divide-y divide-slate-100">
            <div v-for="s in searchedStudents" :key="s.id" class="p-4 space-y-3">
              <div class="flex items-center justify-between gap-3">
                <div class="flex items-center gap-3 min-w-0">
                  <div class="w-8 h-8 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 text-blue-700 flex items-center justify-center font-semibold text-xs shrink-0">{{ initials(s) }}</div>
                  <div class="min-w-0">
                    <p class="font-semibold text-slate-900 truncate">{{ s.first_name }} {{ s.last_name }}</p>
                    <p class="text-xs text-slate-500">Roll {{ s.roll_number || '—' }}</p>
                  </div>
                </div>


                <ActionIconButton
                  v-if="existingResults[s.id]"
                  icon="delete"
                  label="Delete result"
                  @click="openDelete(existingResults[s.id])"
                />
              </div>


              <div class="flex items-center gap-3">
                <input :value="getMark(s.id)" @input="onMarkInput(s.id, $event.target.value)"type="number" :max="selectedExam.max_marks" :min="0" step="0.5" class="input py-1.5 text-sm w-28" :placeholder="`/${selectedExam.max_marks}`">
                <span v-if="getMark(s.id) !== '' && getMark(s.id) !== undefined" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold" :class="gradeColor(computeGrade(parseFloat(getMark(s.id)) || 0, selectedExam.max_marks))">{{ computeGrade(parseFloat(getMark(s.id)) || 0, selectedExam.max_marks) }}</span>
                <span v-if="getMark(s.id) !== '' && getMark(s.id) !== undefined" class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold" :class="parseFloat(getMark(s.id)) >= selectedExam.pass_marks ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'"><span class="w-1.5 h-1.5 rounded-full" :class="parseFloat(getMark(s.id)) >= selectedExam.pass_marks ? 'bg-emerald-500' : 'bg-red-500'"></span>{{ parseFloat(getMark(s.id)) >= selectedExam.pass_marks ? 'Pass' : 'Fail' }}</span>
              </div>
            </div>
          </div>

          <div class="px-5 py-4 border-t border-slate-100 flex justify-end">
            <button class="btn-primary" :disabled="saving" @click="saveResults"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>{{ saving ? 'Saving...' : 'Save All Results' }}</button>
          </div>
        </div>
      </div>

      <!-- Entered results -->
      <div v-if="results.length > 0" class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div class="px-5 py-3.5 border-b border-slate-100 bg-slate-50/50">
          <p class="text-sm font-semibold text-slate-600">Entered Results ({{ results.length }})</p>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-sm">

            <thead>
              
              <tr class="bg-slate-50 border-b border-slate-200">
              <th class="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Student</th>
              <th class="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Marks</th>
              <th class="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Grade</th>
              <th class="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
            </tr>
            
            
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr v-for="r in results" :key="r.id" class="hover:bg-slate-50 transition-colors">
                <td class="px-5 py-3.5 font-semibold text-slate-900">{{ studentName(r) }}</td>
                <td class="px-5 py-3.5 text-slate-700">{{ r.marks_obtained }} / {{ selectedExam.max_marks }}</td>
                <td class="px-5 py-3.5"><span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold" :class="gradeColor(r.grade || 'F')">{{ r.grade }}</span></td>
                <td class="px-5 py-3.5"><span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold" :class="r.status === 'pass' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'"><span class="w-1.5 h-1.5 rounded-full" :class="r.status === 'pass' ? 'bg-emerald-500' : 'bg-red-500'"></span>{{ r.status }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </template>

    <ConfirmDialog v-model="showDelete" @confirm="doDeleteResult">Delete this result record?</ConfirmDialog>
    
  </div>
</template>

<script setup>


const toast = useToast()
const route = useRoute()
const { computeGrade, gradeColor } = useGrade()

const exams = ref([])
const students = ref([])
const results = ref([])
const loading = ref(true)
const saving = ref(false)
const justSaved = ref(false)

const selectedExamId = ref(route.query.exam || '')
const search = ref('')
const marksInput = ref({})
const existingResults = ref({})

const selectedExam = computed(() => 
exams.value.find(e => e.id === selectedExamId.value)

)

const filteredStudents = computed(() => {
  if (!selectedExam.value?.class) return students.value.filter(s => s.status === 'active')
  return students.value.filter(s => s.status === 'active' && (s.class === selectedExam.value.class || !s.class))
})
const searchedStudents = computed(() => {
  const q = search.value.toLowerCase()
  if (!q) return filteredStudents.value
  return filteredStudents.value.filter(s => 
  `${s.first_name} ${s.last_name}`.toLowerCase().includes(q))

})

const stats = computed(() => {
  const entered = results.value.length
  const passed = results.value.filter(r => r.status === 'pass').length
  const avg = entered > 0 ? results.value.reduce((s, r) => s + r.marks_obtained, 0) / entered : 0
  const passRate = entered > 0 ? (passed / entered) * 100 : 0
  return { entered, passed, failed: entered - passed, avg, passRate }
})

const getMark = (id) => marksInput.value[id] || ''
const studentName = (r) =>`${r.first_name || ''} ${r.last_name || ''}`

const formatDate = (d) => {
  if (!d) return "—"

  return new Date(d).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  })
}
const initials = (s) => `${s.first_name?.[0] || ''}${s.last_name?.[0] || ''}`

const onMarkInput = (id, raw) => {
  justSaved.value = false
  if (raw === '') { marksInput.value[id] = ''; return }
  const max = selectedExam.value?.max_marks ?? Infinity
  let n = parseFloat(raw)
  if (isNaN(n)) { marksInput.value[id] = ''; return }
  if (n < 0) n = 0
  if (n > max) n = max
  marksInput.value[id] = String(n)
}

async function loadResults() {

  if (!selectedExamId.value) {
    results.value = []
    existingResults.value = {}
    marksInput.value = {}
    return
  }

  loading.value = true

  try {

    const data = await $fetch(`/api/results?exam_id=${selectedExamId.value}`)

    results.value = data

    const map = {}
    const marks = {}

    data.forEach(r => {
      map[r.student_id] = r
      marks[r.student_id] = String(r.marks_obtained)
    })

    existingResults.value = map
    marksInput.value = marks

  } catch (err) {

    console.error(err)
    toast.error("Failed to load results.")

    results.value = []

  } finally {

    loading.value = false

  }
}

const saveResults = async () => {
  if (!selectedExam.value) return

  saving.value = true

  try {
    const exam = selectedExam.value

    const toUpsert = searchedStudents.value
      .filter(s => marksInput.value[s.id] !== undefined && marksInput.value[s.id] !== '')
      .map(s => {
        const marks = parseFloat(marksInput.value[s.id]) || 0
        const grade = computeGrade(marks, exam.max_marks)
        const status = marks >= exam.pass_marks ? 'pass' : 'fail'
        const existing = existingResults.value[s.id]

        return {
          id: existing?.id,
          exam_id: exam.id,
          student_id: s.id,
          marks_obtained: marks,
          grade,
          status
        }
      })

    for (const result of toUpsert) {
      await $fetch('/api/results', {
        method: 'POST',
        body: result
      })
    }

    justSaved.value = true

    setTimeout(() => {
      justSaved.value = false
    }, 2500)

    await loadResults()

    toast.success("Results saved successfully.")
  } catch (error) {
    console.error(error)
    toast.error("Failed to save results.")
  } finally {
    saving.value = false
  }
}
const showDelete = ref(false)
const deletingResult = ref(null)
const openDelete = (r) => { 
  deletingResult.value = r; 
  showDelete.value = true

}
const doDeleteResult = async () => {
  if (!deletingResult.value) return

  try {
    await $fetch(`/api/results/${deletingResult.value.id}`, {
      method: "DELETE"
    })

    showDelete.value = false
    deletingResult.value = null

    await loadResults()

    toast.success("Result deleted successfully.")
  } catch (error) {
    console.error(error)
    toast.error("Failed to delete result.")
  }
}

watch(selectedExamId, loadResults)

async function fetchExams() {

  try {

    exams.value = await $fetch("/api/exams")

  } catch (e) {

    exams.value = []

  }

}

async function fetchStudents() {

  try {

    students.value = await $fetch("/api/students")

  } catch (e) {

    students.value = []

  }

}

// OPTIMISATION: Replaced onMounted + $fetch with useAsyncData for SSR
const { pending: loadingAsync, refresh: refreshData } = await useAsyncData(
  'results-page',
  async () => {
    await fetchExams()
    await fetchStudents()
    if (exams.value.length) {
      selectedExamId.value = exams.value[0].id
      await loadResults()
    }
  },
  { server: true, lazy: false }
)

const refresh = async () => {
  await refreshData()
}
</script>
