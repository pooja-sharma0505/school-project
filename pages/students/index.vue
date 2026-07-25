<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>

        <h1 class="text-xl font-bold text-slate-900">Student Management</h1>
        <p class="text-sm text-slate-500 mt-0.5">Manage enrollment, contact info, and student status</p>
      </div>

      <button class="btn-primary" @click="openAdd">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4"/></svg>
        Add Student
      </button>
    </div>

    <!-- Stat cards -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
      <button class="bg-white rounded-2xl border shadow-sm p-4 text-left transition-all" :class="statusFilter === '' ? 'border-slate-900 ring-1 ring-slate-900' : 'border-slate-200 hover:border-slate-300'" @click="statusFilter = ''">
        <div class="flex items-center gap-2">
        <span class="w-2.5 h-2.5 rounded-full bg-blue-500"></span><span class="text-sm font-medium text-slate-600">Total</span>
        </div>

        <p class="text-2xl font-bold text-slate-900 mt-1.5">{{ stats.total }}</p>
      </button>

      <button class="bg-white rounded-2xl border shadow-sm p-4 text-left transition-all" :class="statusFilter === 'active' ? 'border-slate-900 ring-1 ring-slate-900' : 'border-slate-200 hover:border-slate-300'" @click="statusFilter = statusFilter === 'active' ? '' : 'active'">

        <div class="flex items-center gap-2">
          <span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
          <span class="text-sm font-medium text-slate-600">Active</span>
        </div>

        <p class="text-2xl font-bold text-slate-900 mt-1.5">{{ stats.active }}</p>
      </button>
      <button class="bg-white rounded-2xl border shadow-sm p-4 text-left transition-all" :class="statusFilter === 'inactive' ? 'border-slate-900 ring-1 ring-slate-900' : 'border-slate-200 hover:border-slate-300'" @click="statusFilter = statusFilter === 'inactive' ? '' : 'inactive'">

        <div class="flex items-center gap-2"><span class="w-2.5 h-2.5 rounded-full bg-slate-400"></span>
          <span class="text-sm font-medium text-slate-600">Inactive</span>
        </div>

        <p class="text-2xl font-bold text-slate-900 mt-1.5">{{ stats.inactive }}</p>

      </button>

      <button class="bg-white rounded-2xl border shadow-sm p-4 text-left transition-all" :class="statusFilter === 'suspended' ? 'border-slate-900 ring-1 ring-slate-900' : 'border-slate-200 hover:border-slate-300'" @click="statusFilter = statusFilter === 'suspended' ? '' : 'suspended'">
        <div class="flex items-center gap-2">
          <span class="w-2.5 h-2.5 rounded-full bg-red-500"></span>
          <span class="text-sm font-medium text-slate-600">Suspended</span>
        </div>
        <p class="text-2xl font-bold text-slate-900 mt-1.5">{{ stats.suspended }}</p>
      </button>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div class="relative">
          <svg class="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          <input v-model="search" type="text" placeholder="Search name, email, roll..." class="input pl-10">
        </div>
        <select v-model="classFilter" class="input">
          <option value="">All Classes</option>
          <option v-for="c in classes" :key="c" :value="c">{{ c }}</option>
        </select>

        <select v-model="statusFilter" class="input">
          <option value="">All Statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="suspended">Suspended</option>
        </select>
      </div>
    </div>

    <!-- Roster -->
    <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div v-if="loading" class="p-6 space-y-4">
        <div v-for="i in 5" :key="i" class="flex items-center gap-4">
          <div class="w-10 h-10 rounded-full bg-slate-200 animate-pulse">
            
          </div>
          <div class="flex-1 space-y-1.5">
            <div class="h-3 w-40 bg-slate-200 rounded animate-pulse">

          </div>
          <div class="h-2.5 w-24 bg-slate-200 rounded animate-pulse">

          </div>
        </div>
          <div class="h-6 w-20 rounded-full bg-slate-200 animate-pulse">

          </div>
        </div>
      </div>

      
      <div v-else-if="filtered.length === 0">
        <EmptyState message="No students found. Try adjusting filters or add a new student.">
          <template #action>
            <button class="btn-primary" @click="openAdd">Add Student</button>
          </template>
        </EmptyState>
      </div>


      <div v-else>
        <!-- Desktop table -->
        <div class="hidden md:block overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="bg-slate-50 border-b border-slate-200">
                <th class="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Student</th>
                <th class="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Class</th>
                <th class="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Roll No</th>
                <th class="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Contact</th>
                <th class="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                <th class="px-5 py-3.5 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>

            
            </thead>

            <tbody class="divide-y divide-slate-100">
              <tr v-for="s in filtered" :key="s.id" class="hover:bg-slate-50 transition-colors">
                <td class="px-5 py-3.5">
                  <div class="flex items-center gap-3">
                    <div class="w-9 h-9 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 text-blue-700 flex items-center justify-center font-semibold text-xs shrink-0">{{ initials(s) }}

                    </div>
                    <div class="min-w-0">
                      <p class="font-semibold text-slate-900 truncate">{{ s.first_name }} {{ s.last_name }}</p>
                      <p class="text-xs text-slate-500 mt-0.5 truncate">{{ s.email || 'No email' }}</p>
                    </div>
                  </div>
                </td>

                <td class="px-5 py-3.5 text-slate-600 font-medium whitespace-nowrap">{{ s.class || '—' }}{{ s.section ? ` · ${s.section}` : '' }}</td>
                <td class="px-5 py-3.5 text-slate-600 font-mono text-xs">{{ s.roll_number || '—' }}</td>
                <td class="px-5 py-3.5 text-slate-600 whitespace-nowrap">{{ s.phone || '—' }}</td>
                <td class="px-5 py-3.5">
                  <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold" :class="s.status === 'active' ? 'bg-emerald-50 text-emerald-700' : s.status === 'suspended' ? 'bg-red-50 text-red-700' : 'bg-slate-100 text-slate-600'">
                    <span class="w-1.5 h-1.5 rounded-full" :class="s.status === 'active' ? 'bg-emerald-500' : s.status === 'suspended' ? 'bg-red-500' : 'bg-slate-400'">

                    </span>
                    {{ s.status }}
                  </span>
                </td>

                <td class="px-5 py-3.5">
                  <div class="flex items-center justify-end gap-1">
                    <ActionIconButton icon="edit" label="Edit student" @click="openEdit(s)" />
                    <ActionIconButton icon="delete" label="Delete student" @click="confirmDelete(s)" />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Mobile stacked cards -->
        <div class="md:hidden divide-y divide-slate-100">
          <div v-for="s in filtered" :key="s.id" class="p-4 space-y-3">
            <div class="flex items-center justify-between gap-3">
              <div class="flex items-center gap-3 min-w-0">
                <div class="w-9 h-9 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 text-blue-700 flex items-center justify-center font-semibold text-xs shrink-0">{{ initials(s) }}</div>
                <div class="min-w-0">
                  <p class="font-semibold text-slate-900 truncate">{{ s.first_name }} {{ s.last_name }}</p>
                  <p class="text-xs text-slate-500 mt-0.5">{{ s.class || 'No class' }}{{ s.section ? ` · ${s.section}` : '' }} · Roll {{ s.roll_number || '—' }}</p>
                </div>
              </div>


              <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold shrink-0" :class="s.status === 'active' ? 'bg-emerald-50 text-emerald-700' : s.status === 'suspended' ? 'bg-red-50 text-red-700' : 'bg-slate-100 text-slate-600'">
                <span class="w-1.5 h-1.5 rounded-full" :class="s.status === 'active' ? 'bg-emerald-500' : s.status === 'suspended' ? 'bg-red-500' : 'bg-slate-400'">

                </span>
                {{ s.status }}
              </span>

            </div>

            <div class="flex items-center justify-between">
              <p class="text-xs text-slate-500">{{ s.phone || 'No phone' }}</p>
              <div class="flex gap-1">
                <ActionIconButton icon="edit" label="Edit student" @click="openEdit(s)" />
                <ActionIconButton icon="delete" label="Delete student" @click="confirmDelete(s)" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Form Modal -->
    <Modal v-model="showForm" :title="editingStudent ? 'Edit Student' : 'Add New Student'">
      <div class="space-y-4">
        <div v-if="formError" class="p-3.5 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700 flex items-center gap-2">
          <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
          </svg>
          {{ formError }}
        </div>


        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1.5">First Name <span class="text-red-500">*</span>
            </label>
            <input v-model="form.first_name" class="input" placeholder="John">
          </div>
          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1.5">Last Name <span class="text-red-500">*</span>
          </label>
          <input v-model="form.last_name" class="input" placeholder="Doe">
          </div>
        </div>


        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1.5">Email</label>
            <input v-model="form.email" type="email" class="input" placeholder="john@school.edu">
          </div>
          <div>

            <label class="block text-sm font-semibold text-slate-700 mb-1.5">Phone</label>
            <input v-model="form.phone" class="input" placeholder="+1 234 567 890">
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1.5">Gender</label>
            <select v-model="form.gender" class="input">
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>



          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1.5">Date of Birth</label>
            <input v-model="form.date_of_birth" type="date" class="input">
          </div>
        </div>

        <div class="grid grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1.5">Class</label>
            <input v-model="form.class" class="input" placeholder="Grade 10">
          </div>

          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1.5">Section</label>
            <input v-model="form.section" class="input" placeholder="A">
          </div>

          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1.5">Roll Number</label>
            <input v-model="form.roll_number" class="input" placeholder="101">
          </div>
        </div>

        <div>
          <label class="block text-sm font-semibold text-slate-700 mb-1.5">Address</label>
          <textarea v-model="form.address" class="input" rows="2" placeholder="123 Main St, City"></textarea>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1.5">Guardian Name</label>
            <input v-model="form.guardian_name" class="input" placeholder="Jane Doe">
          </div>

          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1.5">Guardian Phone</label>
            <input v-model="form.guardian_phone" class="input" placeholder="+1 234 567 890">
          </div>
        </div>
        <div>

          <label class="block text-sm font-semibold text-slate-700 mb-1.5">Status</label>
          <select v-model="form.status" class="input">
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>

        <div class="flex justify-end gap-3 pt-4 border-t border-slate-100 -mx-6 px-6 -mb-5 pb-5 mt-6">
          <button class="btn-secondary" @click="showForm = false">Cancel</button>
          <button class="btn-primary" :disabled="saving" @click="saveStudent">{{ saving ? 'Saving...' : (editingStudent ? 'Update Student' : 'Add Student') }}</button>
        </div>
      </div>
    </Modal>

    <ConfirmDialog v-model="showDelete" @confirm="doDelete">
      Delete <strong>{{ deletingStudent?.first_name }} {{ deletingStudent?.last_name }}</strong>? This also removes all their attendance, fees, and results.
    </ConfirmDialog>

  </div>

</template>


<script setup>
const toast = useToast()

const students = ref([])

const loading = ref(true)
const saving = ref(false)

const search = ref("")
const classFilter = ref("")
const statusFilter = ref("")

const showForm = ref(false)
const showDelete = ref(false)

const editingStudent = ref(null)
const deletingStudent = ref(null)

const formError = ref("")

const form = ref({
  first_name: "",
  last_name: "",
  email: "",
  phone: "",
  gender: "male",
  date_of_birth: "",
  class: "",
  section: "",
  roll_number: "",
  address: "",
  guardian_name: "",
  guardian_phone: "",
  status: "active"
})

const classes = computed(() => {
  return [...new Set(
    students.value
      .map(student => student.class)
      .filter(Boolean)
  )].sort()
})

const filtered = computed(() => {

  return students.value.filter(student => {

    const keyword = search.value.toLowerCase()

    const fullName =
      `${student.first_name} ${student.last_name}`.toLowerCase()

    const searchMatch =
      !keyword ||
      fullName.includes(keyword) ||
      (student.email || "").toLowerCase().includes(keyword) ||
      (student.roll_number || "").toLowerCase().includes(keyword)

    const classMatch =
      !classFilter.value ||
      student.class === classFilter.value

    const statusMatch =
      !statusFilter.value ||
      student.status === statusFilter.value

    return searchMatch && classMatch && statusMatch

  })

})

const stats = computed(() => {

  return {

    total: students.value.length,

    active: students.value.filter(
      student => student.status === "active"
    ).length,

    inactive: students.value.filter(
      student => student.status === "inactive"
    ).length,

    suspended: students.value.filter(
      student => student.status === "suspended"
    ).length

  }

})

const initials = (student) => {

  return `${student.first_name?.[0] || ""}${student.last_name?.[0] || ""}`

}

const resetForm = () => {

  form.value = {
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    gender: "male",
    date_of_birth: "",
    class: "",
    section: "",
    roll_number: "",
    address: "",
    guardian_name: "",
    guardian_phone: "",
    status: "active"
  }

  editingStudent.value = null
  formError.value = ""

}

const openAdd = () => {

  resetForm()
  showForm.value = true

}

const openEdit = (student) => {

  editingStudent.value = student

  form.value = {

    first_name: student.first_name,
    last_name: student.last_name,
    email: student.email || "",
    phone: student.phone || "",
    gender: student.gender || "male",
    date_of_birth: student.date_of_birth || "",
    class: student.class || "",
    section: student.section || "",
    roll_number: student.roll_number || "",
    address: student.address || "",
    guardian_name: student.guardian_name || "",
    guardian_phone: student.guardian_phone || "",
    status: student.status

  }

  formError.value = ""
  showForm.value = true

}
const saveStudent = async () => {

  formError.value = ""

  if (!form.value.first_name || !form.value.last_name) {
   formError.value = "First name and last name are required."
toast.error("First name and last name are required.")
return
    
  }

  saving.value = true

  try {

    const payload = {
      first_name: form.value.first_name,
      last_name: form.value.last_name,
      email: form.value.email || null,
      phone: form.value.phone || null,
      gender: form.value.gender || null,
      date_of_birth: form.value.date_of_birth || null,
      class: form.value.class || null,
      section: form.value.section || null,
      roll_number: form.value.roll_number || null,
      address: form.value.address || null,
      guardian_name: form.value.guardian_name || null,
      guardian_phone: form.value.guardian_phone || null,
      status: form.value.status
    }

    if (editingStudent.value) {

      await $fetch(`/api/students/${editingStudent.value.id}`, {
        method: "PUT",
        body: payload
      })

    } else {

      await $fetch("/api/students", {
        method: "POST",
        body: payload
      })

    }

const isEdit = !!editingStudent.value

showForm.value = false
await fetchStudents()

if (isEdit) {
  toast.success("Student updated successfully.")
} else {
  toast.success("Student added successfully.")
}

resetForm()

  } catch (error) {

    console.error(error)
  formError.value = "Failed to save student."
toast.error("Failed to save student.")

  } finally {

    saving.value = false

  }

}

const confirmDelete = (student) => {

  deletingStudent.value = student
  showDelete.value = true

}

const doDelete = async () => {

  if (!deletingStudent.value) return

  try {

    await $fetch(`/api/students/${deletingStudent.value.id}`, {
      method: "DELETE"
    })

    showDelete.value = false
    deletingStudent.value = null

    await fetchStudents()
toast.success("Student deleted successfully.")
  } catch (error) {

    console.error(error)

  }

}
async function fetchStudents() {

  loading.value = true

  try {

    students.value = await $fetch("/api/students")

  } catch (error) {
    toast.error("Failed to load students.")
    console.error(error)
    students.value = []
  } finally {

    loading.value = false

  }
}


onMounted(async () => {

  await fetchStudents()

})

</script>
