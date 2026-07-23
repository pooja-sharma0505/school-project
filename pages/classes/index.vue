<template>
  <div class="space-y-6">

    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

      <div>
        <h1 class="text-xl font-bold text-slate-900">
          Class Management
        </h1>

        <p class="text-sm text-slate-500 mt-0.5">
          Manage school classes and sections
        </p>
      </div>

      <button
        class="btn-primary"
        @click="openAdd"
      >
        <svg
          class="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2.5"
            d="M12 4v16m8-8H4"
          />
        </svg>

        Add Class
      </button>

    </div>

    <!-- Summary Cards -->

    <div
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
    >

      <!-- Total -->

      <div
        class="bg-white rounded-2xl border border-slate-200 shadow-sm p-5"
      >

        <div
          class="flex items-center gap-3 mb-3"
        >

          <div
            class="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center"
          >

            <svg
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 7h18M3 12h18M3 17h18"
              />
            </svg>

          </div>

          <p
            class="text-sm font-medium text-slate-500"
          >
            Total Classes
          </p>

        </div>

        <p
          class="text-3xl font-bold text-slate-900"
        >
          {{ summary.total }}
        </p>

      </div>

      <!-- Active -->

      <div
        class="bg-white rounded-2xl border border-slate-200 shadow-sm p-5"
      >

        <div
          class="flex items-center gap-3 mb-3"
        >

          <div
            class="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center"
          >

            <svg
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 13l4 4L19 7"
              />
            </svg>

          </div>

          <p
            class="text-sm font-medium text-slate-500"
          >
            Active
          </p>

        </div>

        <p
          class="text-3xl font-bold text-emerald-700"
        >
          {{ summary.active }}
        </p>

      </div>

      <!-- Inactive -->

      <div
        class="bg-white rounded-2xl border border-slate-200 shadow-sm p-5"
      >

        <div
          class="flex items-center gap-3 mb-3"
        >

          <div
            class="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center"
          >

            <svg
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>

          </div>

          <p
            class="text-sm font-medium text-slate-500"
          >
            Inactive
          </p>

        </div>

        <p
          class="text-3xl font-bold text-red-700"
        >
          {{ summary.inactive }}
        </p>

      </div>

      <!-- Capacity -->

      <div
        class="bg-white rounded-2xl border border-slate-200 shadow-sm p-5"
      >

        <div
          class="flex items-center gap-3 mb-3"
        >

          <div
            class="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center"
          >

            <!-- Fixed: was a clock icon, now a people/seats icon to match "capacity" -->
            <svg
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m6-8a4 4 0 110 8 4 4 0 010-8zm-6 0a4 4 0 100 8 4 4 0 000-8z"
              />
            </svg>

          </div>

          <p
            class="text-sm font-medium text-slate-500"
          >
            Total Capacity
          </p>

        </div>

        <p
          class="text-3xl font-bold text-amber-700"
        >
          {{ summary.capacity }}
        </p>

      </div>

    </div>

    <!-- Search -->

    <div
      class="bg-white rounded-2xl border border-slate-200 shadow-sm p-4"
    >

      <div
        class="grid grid-cols-1 md:grid-cols-2 gap-4"
      >

        <div class="relative">

          <svg
            class="absolute left-3 top-3.5 w-5 h-5 text-slate-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>

          <input
            v-model="search"
            class="input pl-10"
            placeholder="Search class..."
          >

        </div>

        <select
          v-model="statusFilter"
          class="input"
        >
          <option value="">
            All Status
          </option>

          <option value="active">
            Active
          </option>

          <option value="inactive">
            Inactive
          </option>

        </select>

      </div>

    </div>
        <!-- Classes Table -->

    <div
      class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
    >

      <!-- Loading -->

      <div
        v-if="loading"
        class="p-6 space-y-4"
      >

        <div
          v-for="i in 6"
          :key="i"
          class="flex items-center gap-4"
        >

          <div class="flex-1 space-y-2">

            <div
              class="h-3 w-40 rounded bg-slate-200 animate-pulse"
            />

            <div
              class="h-3 w-24 rounded bg-slate-200 animate-pulse"
            />

          </div>

          <div
            class="h-8 w-24 rounded bg-slate-200 animate-pulse"
          />

        </div>

      </div>

      <!-- Empty -->

      <div
        v-else-if="filtered.length===0"
      >

        <EmptyState
          message="No classes found."
        >

          <template #action>

            <button
              class="btn-primary"
              @click="openAdd"
            >
              Add Class
            </button>

          </template>

        </EmptyState>

      </div>

      <!-- Data -->

      <div v-else>

        <!-- Desktop -->

        <div class="hidden lg:block overflow-x-auto">

          <table class="w-full text-sm">

            <thead>

              <tr
                class="bg-slate-50 border-b border-slate-200"
              >

                <th class="px-5 py-3 text-left">
                  Class
                </th>

                <th class="px-5 py-3 text-left">
                  Section
                </th>

                <th class="px-5 py-3 text-left">
                  Teacher
                </th>

                <th class="px-5 py-3 text-left">
                  Room
                </th>

                <th class="px-5 py-3 text-left">
                  Capacity
                </th>

                <th class="px-5 py-3 text-left">
                  Status
                </th>

                <th class="px-5 py-3 text-right">
                  Action
                </th>

              </tr>

            </thead>

            <tbody
              class="divide-y divide-slate-100"
            >

              <tr
                v-for="c in filtered"
                :key="c.id"
                class="hover:bg-slate-50"
              >

                <td class="px-5 py-4 font-semibold">

                  {{ c.class_name }}

                </td>

                <td class="px-5 py-4">

                  {{ c.section }}

                </td>

                <td class="px-5 py-4">

                  {{ c.class_teacher }}

                </td>

                <td class="px-5 py-4">

                  {{ c.room_number }}

                </td>

                <td class="px-5 py-4">

                  {{ c.capacity }}

                </td>

                <td class="px-5 py-4">

                  <span
                    class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold"
                    :class="
                      c.status==='active'
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'bg-red-50 text-red-700'
                    "
                  >

                    {{ c.status }}

                  </span>

                </td>

                <td class="px-5 py-4">

                  <div
                    class="flex justify-end gap-2"
                  >
                    <ActionIconButton
                      icon="edit"
                      label="Edit class"
                      @click="openEdit(c)"
                    />
                    <ActionIconButton
                      icon="delete"
                      label="Delete class"
                      @click="confirmDelete(c)"
                    />

                  </div>

                </td>

              </tr>

            </tbody>

          </table>

        </div>

        <!-- Mobile -->

        <div
          class="lg:hidden divide-y divide-slate-100"
        >

          <div
            v-for="c in filtered"
            :key="c.id"
            class="p-4 space-y-3"
          >

            <div
              class="flex justify-between items-start"
            >

              <div>

                <h3
                  class="font-semibold text-slate-900"
                >
                  Class {{ c.class_name }}
                </h3>

                <p
                  class="text-sm text-slate-500"
                >
                  Section {{ c.section }}
                </p>

              </div>

              <span
                class="px-3 py-1 rounded-full text-xs font-semibold"
                :class="
                  c.status==='active'
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'bg-red-50 text-red-700'
                "
              >
                {{ c.status }}
              </span>

            </div>

            <div
              class="grid grid-cols-2 gap-3 text-sm"
            >

              <div>

                <p class="text-slate-500">
                  Teacher
                </p>

                <p class="font-medium">
                  {{ c.class_teacher }}
                </p>

              </div>

              <div>

                <p class="text-slate-500">
                  Room
                </p>

                <p class="font-medium">
                  {{ c.room_number }}
                </p>

              </div>

              <div>

                <p class="text-slate-500">
                  Capacity
                </p>

                <p class="font-medium">
                  {{ c.capacity }}
                </p>

              </div>

            </div>

            <div
              class="flex justify-end gap-2 pt-2"
            >
              <ActionIconButton
                icon="edit"
                label="Edit class"
                @click="openEdit(c)"
              />
              <ActionIconButton
                icon="delete"
                label="Delete class"
                @click="confirmDelete(c)"
              />

            </div>

          </div>

        </div>

      </div>

    </div>
        <!-- Add / Edit Modal -->

    <Modal
      v-model="showForm"
      :title="editingClass ? 'Edit Class' : 'Add Class'"
    >

      <div class="space-y-4">

        <div
          v-if="formError"
          class="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm"
        >
          {{ formError }}
        </div>

        <div class="grid grid-cols-2 gap-4">

          <div>

            <label class="block text-sm font-medium mb-2">
              Class
            </label>

            <input
              v-model="form.class_name"
              class="input"
              placeholder="10"
            >

          </div>

          <div>

            <label class="block text-sm font-medium mb-2">
              Section
            </label>

            <input
              v-model="form.section"
              class="input"
              placeholder="A"
            >

          </div>

        </div>

        <div>

          <label class="block text-sm font-medium mb-2">
            Class Teacher
          </label>

          <input
            v-model="form.class_teacher"
            class="input"
            placeholder="Teacher Name"
          >

        </div>

        <div class="grid grid-cols-2 gap-4">

          <div>

            <label class="block text-sm font-medium mb-2">
              Room Number
            </label>

            <input
              v-model="form.room_number"
              class="input"
              placeholder="101"
            >

          </div>

          <div>

            <label class="block text-sm font-medium mb-2">
              Capacity
            </label>

            <!-- Fixed: added min="0" to prevent negative capacity at the UI layer -->
            <input
              v-model="form.capacity"
              type="number"
              min="0"
              class="input"
            >

          </div>

        </div>

        <div>

          <label class="block text-sm font-medium mb-2">
            Status
          </label>

          <select
            v-model="form.status"
            class="input"
          >

            <option value="active">
              Active
            </option>

            <option value="inactive">
              Inactive
            </option>

          </select>

        </div>

        <div
          class="flex justify-end gap-3 pt-5 border-t border-slate-100"
        >

          <button
            class="btn-secondary"
            @click="showForm=false"
          >
            Cancel
          </button>

          <button
            class="btn-primary"
            :disabled="saving"
            @click="saveClass"
          >
            {{ saving
              ? 'Saving...'
              : editingClass
                ? 'Update Class'
                : 'Add Class'
            }}
          </button>

        </div>

      </div>

    </Modal>

    <!-- Delete -->

    <ConfirmDialog
      v-model="showDelete"
      @confirm="doDelete"
    >

      Delete

      <b>

        {{ deletingClass?.class_name }}

      </b>

      -

      Section

      <b>

        {{ deletingClass?.section }}

      </b>

      ?

      This action cannot be undone.

    </ConfirmDialog>

  </div>

</template>
<script setup>
const toast = useToast()
const classes = ref([])

const loading = ref(true)
const saving = ref(false)

const search = ref("")
const statusFilter = ref("")

const showForm = ref(false)
const showDelete = ref(false)

const editingClass = ref(null)
const deletingClass = ref(null)

const formError = ref("")

const form = ref({
  class_name: "",
  section: "",
  class_teacher: "",
  room_number: "",
  capacity: 40,
  status: "active"
})

const summary = computed(() => {

  return {

    total: classes.value.length,

    active: classes.value.filter(
      c => c.status === "active"
    ).length,

    inactive: classes.value.filter(
      c => c.status === "inactive"
    ).length,

    capacity: classes.value.reduce(
      (sum, c) => sum + Number(c.capacity || 0),
      0
    )

  }

})

const filtered = computed(() => {

  return classes.value.filter(c => {

    const keyword = search.value.toLowerCase()

    // Fixed: coerce class_name/section to string in case they come back
    // from the API as numbers (e.g. class_name = 10 instead of "10"),
    // which would otherwise throw on .toLowerCase()
    const matchSearch =
      !keyword ||

      String(c.class_name).toLowerCase().includes(keyword) ||

      String(c.section).toLowerCase().includes(keyword) ||

      (c.class_teacher || "")
        .toLowerCase()
        .includes(keyword)

    const matchStatus =
      !statusFilter.value ||
      c.status === statusFilter.value

    return matchSearch && matchStatus

  })

})

function resetForm() {

  form.value = {

    class_name: "",

    section: "",

    class_teacher: "",

    room_number: "",

    capacity: 40,

    status: "active"

  }

  editingClass.value = null

  formError.value = ""

}

function openAdd() {

  resetForm()

  showForm.value = true

}

function openEdit(item) {

  // Fixed: clear any stale error left over from a previous failed
  // Add/Edit attempt so it doesn't show up on an unrelated row
  formError.value = ""

  editingClass.value = item

  form.value = {

    class_name: item.class_name,

    section: item.section,

    class_teacher: item.class_teacher,

    room_number: item.room_number,

    capacity: item.capacity,

    status: item.status

  }

  showForm.value = true

}

async function saveClass() {

  formError.value = ""

  if (
    !form.value.class_name ||
    !form.value.section
  ) {

  formError.value = "Class and Section are required."
toast.error("Class and Section are required.")
return

  }

  saving.value = true

  try {

    const payload = {

      class_name: form.value.class_name,

      section: form.value.section,

      class_teacher: form.value.class_teacher,

      room_number: form.value.room_number,

      capacity: Number(form.value.capacity),

      status: form.value.status

    }

    if (editingClass.value) {

      await $fetch(
        `/api/classes/${editingClass.value.id}`,
        {
          method: "PUT",
          body: payload
        }
      )

    } else {

      await $fetch(
        "/api/classes",
        {
          method: "POST",
          body: payload
        }
      )

    }

   const isEdit = !!editingClass.value

showForm.value = false
resetForm()

await fetchClasses()

if (isEdit) {
  toast.success("Class updated successfully.")
} else {
  toast.success("Class added successfully.")
}

  }

  catch (err) {

    console.error(err)


formError.value = "Unable to save class."
toast.error("Unable to save class.")

  }

  finally {

    saving.value = false

  }

}

function confirmDelete(item) {

  deletingClass.value = item

  showDelete.value = true

}

async function doDelete() {

  if (!deletingClass.value)
    return

  try {

    await $fetch(
      `/api/classes/${deletingClass.value.id}`,
      {
        method: "DELETE"
      }
    )

    showDelete.value = false

    deletingClass.value = null

    await fetchClasses()
toast.success("Class deleted successfully.")
  }

catch (err) {
  console.error(err)
  toast.error("Failed to delete class.")
}

}

async function fetchClasses() {

  loading.value = true

  try {

    classes.value =
      await $fetch("/api/classes")

  }
catch (err) {
  console.error(err)
  classes.value = []
  toast.error("Failed to load classes.")
}

  finally {

    loading.value = false

  }

}

onMounted(() => {

  fetchClasses()

})
</script>
