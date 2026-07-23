<template>
  <div class="space-y-6 pb-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
      <div>
        <h1 class="text-xl font-bold text-slate-900">Attendance Management</h1>
        <p class="text-sm text-slate-500 mt-0.5">{{ formatDate(selectedDate) }}</p>
      </div>
      <div class="flex items-center gap-1.5 bg-white border border-slate-200 rounded-xl p-1 shadow-sm self-start sm:self-auto">
        <button class="p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors" aria-label="Previous day" @click="shiftDate(-1)">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7"/></svg>
        </button>
        <span class="text-xs font-semibold text-slate-600 px-1 w-16 text-center">{{ isToday ? 'Today' : 'Selected' }}</span>
        <button class="p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors" aria-label="Next day" @click="shiftDate(1)">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"/></svg>
        </button>
      </div>
    </div>

    <!-- Controls -->
    <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
      <div class="flex flex-col lg:flex-row gap-4 items-stretch lg:items-end">
        <div class="flex-1"><label class="block text-sm font-semibold text-slate-700 mb-1.5">Date</label><input v-model="selectedDate" type="date" class="input"></div>
        <div class="flex-1"><label class="block text-sm font-semibold text-slate-700 mb-1.5">Class Filter</label>
          <select v-model="classFilter" class="input"><option value="">All Classes</option><option v-for="c in classes" :key="c" :value="c">{{ c }}</option></select>
        </div>
        <div class="flex-1">
          <label class="block text-sm font-semibold text-slate-700 mb-1.5">Search</label>
          <div class="relative">
            <svg class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-4.35-4.35M17 10a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            <input v-model="search" type="text" placeholder="Name or roll no." class="input pl-9">
          </div>
        </div>
        <button class="btn-success shrink-0" @click="markAll('present')">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>
          Mark All Present
        </button>
      </div>
    </div>

    <!-- Quick stats -->
    <div class="grid grid-cols-2 sm:grid-cols-5 gap-3">
      <div v-for="opt in [...statusOptions, { value: 'unmarked', label: 'Unmarked', dot: 'bg-slate-300' }]" :key="opt.value" class="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
        <div class="flex items-center gap-2"><span class="w-2.5 h-2.5 rounded-full" :class="opt.dot"></span><span class="text-sm font-medium text-slate-600">{{ opt.label }}</span></div>
        <p class="text-2xl font-bold text-slate-900 mt-1.5">{{ stats[opt.value] || 0 }}</p>
      </div>
    </div>

    <!-- Roster -->
    <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div v-if="loading" class="p-6 space-y-4">
        <div v-for="i in 5" :key="i" class="flex items-center gap-4">
          <div class="w-9 h-9 rounded-full bg-slate-200 animate-pulse"></div>
          <div class="flex-1 h-3 w-32 bg-slate-200 rounded animate-pulse"></div>
          <div class="h-7 w-16 bg-slate-200 rounded-lg animate-pulse"></div>
        </div>
      </div>

      <div v-else-if="filteredStudents.length === 0" class="p-6">
        <EmptyState :message="search ? `No students match “${search}”.` : 'No active students found for this filter.'" />
      </div>

      <div v-else>
        <!-- Desktop table -->
        <div class="hidden sm:block overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="bg-slate-50 border-b border-slate-200">
                <th class="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Student</th>
                <th class="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Roll No</th>
                <th class="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Class</th>
                <th class="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr v-for="s in filteredStudents" :key="s.id" class="hover:bg-slate-50 transition-colors">
                <td class="px-5 py-3.5">
                  <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 text-blue-700 flex items-center justify-center font-semibold text-xs shrink-0">{{ initials(s) }}</div>
                    <span class="font-semibold text-slate-900">{{ s.first_name }} {{ s.last_name }}</span>
                  </div>
                </td>
                <td class="px-5 py-3.5 font-mono text-xs text-slate-600">{{ s.roll_number || '—' }}</td>
                <td class="px-5 py-3.5 text-slate-600">{{ s.class || '—' }}</td>
                <td class="px-5 py-3.5">
                  <div class="flex gap-1.5 flex-wrap">
                    <button v-for="opt in statusOptions" :key="opt.value"
                      class="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all active:scale-95"
                      :class="getStatus(s.id) === opt.value ? opt.active : 'bg-slate-50 text-slate-500 hover:bg-slate-100 border border-slate-200'"
                      @click="setStatus(s.id, opt.value)">
                      <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" :d="opt.icon"/></svg>
                      {{ opt.label }}
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Mobile stacked cards -->
        <div class="sm:hidden divide-y divide-slate-100">
          <div v-for="s in filteredStudents" :key="s.id" class="p-4 space-y-3">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 text-blue-700 flex items-center justify-center font-semibold text-xs shrink-0">{{ initials(s) }}</div>
              <div class="min-w-0">
                <p class="font-semibold text-slate-900 truncate">{{ s.first_name }} {{ s.last_name }}</p>
                <p class="text-xs text-slate-500">{{ s.class || '—' }} · Roll {{ s.roll_number || '—' }}</p>
              </div>
            </div>
            <div class="flex gap-1.5 flex-wrap">
              <button v-for="opt in statusOptions" :key="opt.value"
                class="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all active:scale-95"
                :class="getStatus(s.id) === opt.value ? opt.active : 'bg-slate-50 text-slate-500 hover:bg-slate-100 border border-slate-200'"
                @click="setStatus(s.id, opt.value)">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" :d="opt.icon"/></svg>
                {{ opt.label }}
              </button>
            </div>
          </div>
        </div>

        <!-- Sticky save bar -->
        <div class="px-5 py-4 border-t border-slate-100 flex items-center justify-end gap-3 sticky bottom-0 bg-white/95 backdrop-blur">
          <span v-if="justSaved" class="text-sm font-medium text-emerald-600 flex items-center gap-1.5">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>
            Saved
          </span>
          <button class="btn-primary" :disabled="saving || filteredStudents.length === 0" @click="saveAttendance">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
            {{ saving ? 'Saving...' : 'Save Attendance' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup>

const toast = useToast()
const loading = ref(true)
const saving = ref(false)
const justSaved = ref(false)

const students = ref([])
const attendanceMap = ref({})

const classFilter = ref("")
const search = ref("")
const selectedDate = ref(
  new Date().toISOString().split("T")[0]
)

const classes = computed(() => {
  return [...new Set(
    students.value
      .map(student => student.class)
      .filter(Boolean)
  )].sort()
})

const filteredStudents = computed(() => {
  let list = [...students.value]

  // Class Filter
  if (classFilter.value) {
    list = list.filter(student => student.class === classFilter.value)
  }

  // Search Filter
  if (search.value.trim()) {
    const keyword = search.value.trim().toLowerCase()

    list = list.filter(student => {
      const fullName =
        `${student.first_name} ${student.last_name}`.toLowerCase()

      const roll =
        (student.roll_number || "").toLowerCase()

      return (
        fullName.includes(keyword) ||
        roll.includes(keyword)
      )
    })
  }

  return list
})
const statusOptions = [
  {
    value: "present",
    label: "Present",
    active: "bg-emerald-500 text-white",
    dot: "bg-emerald-500",
    icon: "M5 13l4 4L19 7"
  },
  {
    value: "absent",
    label: "Absent",
    active: "bg-red-500 text-white",
    dot: "bg-red-500",
    icon: "M6 18L18 6M6 6l12 12"
  },
  {
    value: "late",
    label: "Late",
    active: "bg-amber-500 text-white",
    dot: "bg-amber-500",
    icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
  },
  {
    value: "leave",
    label: "Leave",
    active: "bg-slate-500 text-white",
    dot: "bg-slate-500",
    icon: "M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013 3v1"
  }
]

const getStatus = (id) => {
  return attendanceMap.value[id] || "unmarked"
}
const setStatus = (id, status) => {
  attendanceMap.value[id] = status
  justSaved.value = false
}

const markAll = (status) => {
  filteredStudents.value.forEach(student => {
    attendanceMap.value[student.id] = status
  })

  justSaved.value = false

  toast.success("All students marked as present.")
}

const stats = computed(() => {
  const count = {
    present: 0,
    absent: 0,
    late: 0,
    leave: 0,
    unmarked: 0
  }

  filteredStudents.value.forEach(student => {
    const status = attendanceMap.value[student.id]

    if (status) {
      count[status]++
    } else {
      count.unmarked++
    }
  })

  return count
})

const initials = (student) => {
  return `${student.first_name?.[0] || ""}${student.last_name?.[0] || ""}`
}

const formatDate = (date) => {
  return new Date(date + "T00:00").toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric"
  })
}

const shiftDate = (days) => {
  const date = new Date(selectedDate.value + "T00:00")

  date.setDate(date.getDate() + days)

  selectedDate.value = date.toISOString().split("T")[0]
}

const isToday = computed(() => {
  return selectedDate.value === new Date().toISOString().split("T")[0]
})
const loadData = async () => {
  loading.value = true
  justSaved.value = false

  try {
    const [studentData, attendanceData] = await Promise.all([
      $fetch("/api/students"),
      $fetch(`/api/attendance?date=${selectedDate.value}`)
    ])

    students.value = studentData

  const map = {}

students.value.forEach((student) => {
  map[student.id] = "unmarked"
})

attendanceData.forEach((item) => {
  map[item.student_id] = item.status
})

attendanceMap.value = map
  } catch (error) {
  console.error("Load Error:", error)
  toast.error("Failed to load attendance.")
} finally {
    loading.value = false
  }
}

const saveAttendance = async () => {
  saving.value = true

  try {
    const requests = filteredStudents.value.map((student) => {
      return $fetch("/api/attendance", {
        method: "POST",
        body: {
          student_id: student.id,
          attendance_date: selectedDate.value,
       status:
  attendanceMap.value[student.id] === "unmarked"
    ? "present"
    : attendanceMap.value[student.id]
        }
      })
    })

    await Promise.all(requests)

    justSaved.value = true

    setTimeout(() => {
      justSaved.value = false
    }, 2500)

    await loadData()
    toast.success("Attendance saved successfully.")

  } catch (error) {
  console.error("Save Error:", error)
  toast.error("Failed to save attendance.")
} finally {
    saving.value = false
  }
}


watch(selectedDate, () => {
  loadData()
})

onMounted(() => {
  loadData()
})
</script>