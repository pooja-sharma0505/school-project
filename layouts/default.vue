<template>
  <div class="min-h-screen flex bg-slate-50">
    <!-- Mobile overlay -->
    <Transition enter-active-class="transition-opacity duration-200" leave-active-class="transition-opacity duration-200" enter-from-class="opacity-0" leave-to-class="opacity-0">

      <div v-if="sidebarOpen" class="fixed inset-0 bg-slate-900/50 z-30 lg:hidden backdrop-blur-sm" @click="sidebarOpen = false" />
    </Transition>

    <!-- Sidebar -->
    <aside
      class="fixed lg:sticky top-0 left-0 h-screen w-64 bg-slate-900 flex flex-col z-40 shrink-0 transition-transform duration-300 lg:translate-x-0"
      :class="sidebarOpen ? 'translate-x-0' : '-translate-x-full'"
    >
      <!-- Brand -->
      <div class="px-5 py-5 border-b border-white/10">
        <div class="flex items-center gap-3">
          <div class="relative shrink-0">
            <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center font-bold text-white text-lg shadow-lg">S</div>
            <span class="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-slate-900"></span>
          </div>
          <div>
            <p class="font-bold text-white text-base leading-tight">Scholar MS</p>
            <p class="text-xs text-slate-400 mt-0.5">School Management</p>
          </div>
        </div>
      </div>

      <!-- Nav -->
      <nav class="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        <div v-for="group in navGroups" :key="group.label" class="space-y-0.5">
          <p class="px-3 pb-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">{{ group.label }}</p>
          <NuxtLink
            v-for="item in group.items"
            :key="item.to"
            :to="item.to"
            class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150"
            :class="route.path === item.to
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/30'
              : 'text-slate-400 hover:bg-white/10 hover:text-white'"
            @click="sidebarOpen = false"
          >
            <svg v-if="item.icon === 'home'" class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
            </svg>


            <svg v-else-if="item.icon === 'users'" class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>


<svg
  v-else-if="item.icon === 'academic-cap'"
  class="w-5 h-5 shrink-0"
  fill="none"
  stroke="currentColor"
  viewBox="0 0 24 24"
>
  <path
    stroke-linecap="round"
    stroke-linejoin="round"
    stroke-width="2"
    d="M12 14L3 9l9-5 9 5-9 5zm0 0v6m0-6l9-5M12 20l-5-2.5"
  />
</svg>



            <svg v-else-if="item.icon === 'calendar'" class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>


            <svg v-else-if="item.icon === 'wallet'" class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"/>
            </svg>




<svg
  v-else-if="item.icon === 'book'"
  class="w-5 h-5 shrink-0"
  fill="none"
  stroke="currentColor"
  viewBox="0 0 24 24"
>
  <path
    stroke-linecap="round"
    stroke-linejoin="round"
    stroke-width="2"
    d="M12 6.253v13M12 6.253C10.832 5.477 9.246 5 7.5 5C5.754 5 4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18c1.746 0 3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
  />
</svg>

            <svg v-else-if="item.icon === 'clipboard'" class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
            </svg>


            <svg v-else-if="item.icon === 'chart'" class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
            </svg>
            <span>{{ item.label }}</span>
          </NuxtLink>
        </div>
      </nav>

      <!-- Footer -->
      <div class="px-4 py-4 border-t border-white/10">
        <div class="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/5">
          <div class="w-8 h-8 rounded-lg bg-slate-700 flex items-center justify-center shrink-0">
            <svg class="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
          </div>
          <div class="min-w-0">
            <p class="text-sm font-semibold text-slate-200 truncate">Administrator</p>
            <p class="text-xs text-slate-500 truncate">admin@scholar.edu</p>
          </div>
        </div>
      </div>
    </aside>

    <!-- Main -->
    <div class="flex-1 flex flex-col min-w-0 overflow-hidden">
      <!-- Top bar -->
      <header class="sticky top-0 z-20 bg-white border-b border-slate-200 px-4 lg:px-8 py-0 flex items-center gap-4 h-16">
        <button class="lg:hidden p-2 rounded-lg hover:bg-slate-100 text-slate-500" @click="sidebarOpen = !sidebarOpen">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
        </button>


        <div class="flex-1 min-w-0">
          <h2 class="text-base font-bold text-slate-900 truncate">{{ currentTitle }}</h2>
          <p class="text-xs text-slate-500 truncate hidden sm:block">{{ currentSubtitle }}</p>
        </div>


        <div class="flex items-center gap-2 shrink-0">
          <span class="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-700">
            <span class="relative flex h-2 w-2">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
            Live
          </span>


          <button class="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
            </svg>
          </button>
        </div>
      </header>

      <main class="flex-1 p-5 lg:p-8 overflow-y-auto">
        <slot />
      </main>
    </div>
  </div>
</template>



<script setup lang="ts">
const route = useRoute()
const sidebarOpen = ref(false)

const navGroups = [
  {
    label: 'Main',
    items: [
      { label: 'Dashboard', to: '/', icon: 'home' },
      { label: 'Students', to: '/students', icon: 'users' },
      { label: 'Classes', to: '/classes', icon: 'academic-cap' },
      { label: 'Attendance', to: '/attendance', icon: 'calendar' },
    ]
  },
  {
    label: 'Academics',
    items: [
      { label: 'Fees', to: '/fees', icon: 'wallet' },
       { label: 'Subjects', to: '/subjects', icon: 'book' },
      { label: 'Exams', to: '/exams', icon: 'clipboard' },
      { label: 'Results', to: '/results', icon: 'chart' },
    ]
  }
]

const allItems = navGroups.flatMap(g => g.items)
const currentPage = computed(() => allItems.find(n => n.to === route.path))
const currentTitle = computed(() => currentPage.value?.label || 'Scholar MS')
const subtitleMap: Record<string, string> = {
  '/': 'Overview & insights',
  '/students': 'Manage student records',
  '/classes': 'Manage classes',
  '/attendance': 'Track daily attendance',
  '/fees': 'Fee collection & payments',
  '/subjects': 'Manage school subjects',
  '/exams': 'Schedule examinations',
  '/results': 'Enter & view results'
}
const currentSubtitle = computed(() => subtitleMap[route.path] || '')
</script>
