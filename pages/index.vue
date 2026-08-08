<template>
  <div class="space-y-6">
    <!-- Hero -->
    <div class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 p-6 lg:p-8 text-white shadow-lg">
      <div class="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20"></div>
      <div class="absolute bottom-0 right-32 w-32 h-32 bg-white/5 rounded-full -mb-12"></div>
      <div class="relative">
        <p class="text-blue-200 text-sm font-medium">{{ todayFormatted }}</p>
        <h1 class="mt-2 text-2xl font-bold tracking-tight">Welcome to Scholar MS</h1>
        <p class="mt-2 text-blue-100 text-sm max-w-lg">Your complete school management platform — manage students, track attendance, collect fees, and publish results.</p>

        <div class="mt-5 flex flex-wrap gap-3">
          <NuxtLink to="/students" class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-blue-700 text-sm font-semibold hover:bg-blue-50 shadow-sm transition-colors">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4"/></svg>
            Add Student
          </NuxtLink>

          <NuxtLink to="/attendance" class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 text-white text-sm font-semibold hover:bg-white/20 border border-white/20 transition-colors">
            Mark Attendance
          </NuxtLink>

          <NuxtLink to="/classes" class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 text-white text-sm font-semibold hover:bg-white/20 border border-white/20 transition-colors">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
            Manage Classes
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- DB Error Banner -->
    <div v-if="!dbHealthy" class="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center gap-4">
      <svg class="w-5 h-5 text-red-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
      </svg>
      <div class="flex-1">
        <p class="font-semibold text-red-800">Database Connection Issue</p>
        <p class="text-sm text-red-700">{{ apiError }}</p>
      </div>
      <button class="btn-primary btn-sm shrink-0" :disabled="retrying" @click="retryDashboard">
        {{ retrying ? "Retrying..." : "Retry Connection" }}
      </button>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <NuxtLink v-for="(s, i) in stats" :key="s.label" :to="
        s.icon === 'users' ? '/students'
        : s.icon === 'academic-cap' ? '/classes'
        : s.icon === 'book' ? '/subjects'
        : s.icon === 'calendar' ? '/attendance'
        : s.icon === 'wallet' ? '/fees'
        : '/exams'
      ">
        <StatCard :label="s.label" :value="s.value" :icon="s.icon" :color="s.color" :trend="s.trend" />
      </NuxtLink>
    </div>

    <!-- Two columns -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">

      <!-- Recent students -->
      <div class="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div class="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <h3 class="font-bold text-slate-900">Recently Added Students</h3>
            <p class="text-xs text-slate-500 mt-0.5">Latest enrollments</p>
          </div>
          <NuxtLink to="/students" class="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1">
            View all
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
          </NuxtLink>
        </div>

        <div v-if="loading" class="p-6 space-y-4">
          <div v-for="i in 4" :key="i" class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-slate-200 animate-pulse"></div>
            <div class="flex-1 space-y-1.5">
              <div class="h-3 w-32 bg-slate-200 rounded animate-pulse"></div>
              <div class="h-2.5 w-24 bg-slate-200 rounded animate-pulse"></div>
            </div>
          </div>
        </div>

        <div v-else-if="recentStudents.length === 0" class="py-4">
          <EmptyState message="No students added yet. Add your first student to get started.">
            <template #action>
              <NuxtLink to="/students" class="btn-primary">Add Student</NuxtLink>
            </template>
          </EmptyState>
        </div>

        <div v-else class="divide-y divide-slate-100">
          <div v-for="s in recentStudents" :key="s.id" class="flex items-center justify-between px-6 py-3.5 hover:bg-slate-50 transition-colors">
            <div class="flex items-center gap-3.5 min-w-0">
              <div class="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 text-blue-700 flex items-center justify-center font-semibold text-xs shrink-0">{{ initials(s) }}</div>
              <div class="min-w-0">
                <p class="font-semibold text-slate-900 text-sm truncate">{{ s.first_name }} {{ s.last_name }}</p>
                <p class="text-xs text-slate-500 mt-0.5 truncate">{{ s.class || 'No class' }} · Roll: {{ s.roll_number || '—' }}</p>
              </div>
            </div>
            <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold shrink-0" :class="s.status === 'active' ? 'bg-emerald-50 text-emerald-700' : s.status === 'suspended' ? 'bg-red-50 text-red-700' : 'bg-slate-100 text-slate-600'">
              <span class="w-1.5 h-1.5 rounded-full" :class="s.status === 'active' ? 'bg-emerald-500' : s.status === 'suspended' ? 'bg-red-500' : 'bg-slate-400'"></span>
              {{ s.status }}
            </span>
          </div>
        </div>
      </div>

      <!-- Fee summary -->
      <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div>
          <h3 class="font-bold text-slate-900">Fee Summary</h3>
          <p class="text-xs text-slate-500 mt-0.5">Collection overview</p>
        </div>

        <div v-if="loading" class="p-5 rounded-xl bg-slate-100 h-[84px] animate-pulse"></div>
        <div v-else-if="feeStats.collected === 0 && feeStats.pending === 0" class="py-4">
          <EmptyState message="No fee records yet. Add a fee to get started.">
            <template #action>
              <NuxtLink to="/fees" class="btn-primary">Add Fee</NuxtLink>
            </template>
          </EmptyState>
        </div>

        <template v-else>
          <div class="relative overflow-hidden p-5 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-white">
            <div class="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-8 -mt-8"></div>
            <p class="text-emerald-50 text-sm font-medium">Total Collected</p>
            <p class="text-3xl font-bold mt-1.5 tracking-tight">{{ formatCurrency(feeStats.collected) }}</p>
          </div>
          <div class="relative overflow-hidden p-5 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 text-white">
            <div class="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-8 -mt-8"></div>
            <p class="text-amber-50 text-sm font-medium">Total Pending</p>
            <p class="text-3xl font-bold mt-1.5 tracking-tight">{{ formatCurrency(feeStats.pending) }}</p>
          </div>
        </template>

        <NuxtLink to="/fees" class="btn-secondary w-full justify-center">Manage Fees</NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
const loading = ref(true)
const dbHealthy = ref(true)
const apiError = ref("")
const retrying = ref(false)
const requestHeaders = import.meta.server ? useRequestHeaders(['cookie']) : undefined

const recentStudents = ref([])
const feeStats = ref({ collected: 0, pending: 0 })

const stats = ref([
  { label: "Total Students", value: 0, icon: "users", color: "bg-blue-50 text-blue-600", trend: "" },
  { label: "Classes", value: 0, icon: "academic-cap", color: "bg-purple-50 text-purple-600", trend: "" },
  { label: "Subjects", value: 0, icon: "book", color: "bg-indigo-50 text-indigo-600", trend: "" },
  { label: "Present Today", value: 0, icon: "calendar", color: "bg-emerald-50 text-emerald-600", trend: "" },
  { label: "Pending Fees", value: 0, icon: "wallet", color: "bg-amber-50 text-amber-600", trend: "" },
  { label: "Upcoming Exams", value: 0, icon: "clipboard", color: "bg-cyan-50 text-cyan-600", trend: "" },
])

const formatCurrency = (value) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(Number(value || 0))
}

const todayFormatted = new Date().toLocaleDateString("en-IN", {
  weekday: "long",
  month: "long",
  day: "numeric",
  year: "numeric"
})

const initials = (student) => {
  return `${student.first_name?.[0] || ""}${student.last_name?.[0] || ""}`
}

async function loadDashboard() {
  loading.value = true
  apiError.value = ""

  try {
    const data = await $fetch("/api/dashboard", {
      headers: requestHeaders
    })

    dbHealthy.value = data.dbHealthy

    // Recent students
    recentStudents.value = data.recentStudents

    // Fee stats
    feeStats.value = data.feeStats

    // Stats
    stats.value[0].value = data.stats.students
    stats.value[0].trend = `${data.stats.studentsActive} active`

    stats.value[1].value = data.stats.classes
    stats.value[1].trend = `${data.stats.classesActive} active`

    stats.value[2].value = data.stats.subjects
    stats.value[2].trend = `${data.stats.subjectsActive} active`

    stats.value[3].value = data.stats.presentToday
    stats.value[3].trend = "Today"

    stats.value[4].value = data.stats.pendingFees
    stats.value[4].trend = formatCurrency(data.feeStats.pending)

    stats.value[5].value = data.stats.upcomingExams
    stats.value[5].trend = "Scheduled"

    return data
  } catch (error) {
    console.error("Dashboard load error:", error)
    apiError.value = error?.data?.message || error?.message || "Failed to load dashboard data."
    dbHealthy.value = false
    return null
  } finally {
    loading.value = false
  }
}

async function retryDashboard() {
  retrying.value = true
  try {
    await refresh()
  } catch (error) {
    console.error("Retry error:", error)
    apiError.value = "Failed to reload dashboard data."
  } finally {
    retrying.value = false
  }
}

// OPTIMISATION: Replaced onMounted + $fetch with useAsyncData for SSR
const { pending: loadingAsync, refresh: refreshData } = await useAsyncData(
  'dashboard',
  () => loadDashboard(),
  { server: true, lazy: false }
)

const refresh = async () => {
  await refreshData()
}
</script>
