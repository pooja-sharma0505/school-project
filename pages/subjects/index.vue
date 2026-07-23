<template>
  <div class="space-y-6">

    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

      <div>
        <h1 class="text-xl font-bold text-slate-900">
          Subject Management
        </h1>

        <p class="text-sm text-slate-500 mt-1">
          Manage school subjects and assign them to classes.
        </p>
      </div>

      <button
        class="btn-primary"
        @click="openAdd">

        <svg
          class="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24">

          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2.5"
            d="M12 4v16m8-8H4"
          />
        </svg>

        Add Subject
      </button>

    </div>

    <!-- Summary Cards -->

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

      <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">

        <p class="text-sm text-slate-500">
          Total Subjects
        </p>

        <h2 class="mt-2 text-3xl font-bold text-slate-900">
          {{ summary.total }}
        </h2>

      </div>

      <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">

        <p class="text-sm text-slate-500">
          Active
        </p>

        <h2 class="mt-2 text-3xl font-bold text-emerald-600">
          {{ summary.active }}
        </h2>

      </div>

      <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">

        <p class="text-sm text-slate-500">
          Inactive
        </p>

        <h2 class="mt-2 text-3xl font-bold text-red-600">
          {{ summary.inactive }}
        </h2>

      </div>

      <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">

        <p class="text-sm text-slate-500">
          Classes
        </p>

        <h2 class="mt-2 text-3xl font-bold text-blue-600">
          {{ classes.length }}
        </h2>

      </div>

    </div>

    <!-- Filters -->

    <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">

        <!-- Search -->

        <input
          v-model="search"
          type="text"
          placeholder="Search subject..."
          class="input" >

        <!-- Class -->

        <select
          v-model="classFilter"
          class="input">

          <option value="">
            All Classes
          </option>

          <option
            v-for="c in classes"
            :key="c.id"
            :value="c.id">
            {{ c.class_name }} - {{ c.section }}
          </option>

        </select>

        <!-- Status -->

        <select
          v-model="statusFilter"
          class="input">

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

    <!-- Subjects Table -->

    <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

      <div
        v-if="loading"
        class="p-6 text-center text-slate-500">
        Loading subjects...
      </div>

      <div
        v-else-if="filtered.length === 0"
        class="p-8 text-center text-slate-500" >
        No subjects found.
      </div>

      <div
        v-else
        class="overflow-x-auto">

        <table class="w-full text-sm">

          <thead>

            <tr class="bg-slate-50 border-b border-slate-200">

              <th class="px-5 py-3 text-left">
                Subject
              </th>

              <th class="px-5 py-3 text-left">
                Code
              </th>

              <th class="px-5 py-3 text-left">
                Class
              </th>

              <th class="px-5 py-3 text-left">
                Teacher
              </th>

              <th class="px-5 py-3 text-left">
                Status
              </th>

              <th class="px-5 py-3 text-right">
                Action
              </th>

            </tr>

          </thead>

          <tbody class="divide-y divide-slate-100">
            <tr
              v-for="subject in filtered"
              :key="subject.id"
              class="hover:bg-slate-50 transition-colors">

              <td class="px-5 py-4 font-semibold text-slate-900">
                {{ subject.subject_name }}
              </td>

              <td class="px-5 py-4 text-slate-600">
                {{ subject.subject_code || "-" }}
              </td>

              <td class="px-5 py-4">
                {{ subject.class_name }}
                <span
                  v-if="subject.section"
                  class="text-slate-500"
                >
                  - {{ subject.section }}
                </span>
              </td>

              <td class="px-5 py-4 text-slate-600">
                {{ subject.teacher_name || "-" }}
              </td>

              <td class="px-5 py-4">

                <span
                  class="inline-flex px-3 py-1 rounded-full text-xs font-semibold"
                  :class="
                    subject.status === 'active'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'">
                  {{ subject.status }}
                </span>

              </td>

              <td class="px-5 py-4">

                <div class="flex justify-end gap-2">
                  <ActionIconButton
                    icon="edit"
                    label="Edit subject"
                    @click="openEdit(subject)"
                  />
                  <ActionIconButton
                    icon="delete"
                    label="Delete subject"
                    @click="confirmDelete(subject)"
                  />

                </div>

              </td>

            </tr>

          </tbody>

        </table>

      </div>

    </div>

    <!-- Add / Edit Subject -->

    <Modal
      v-model="showForm"
      :title="editingSubject ? 'Edit Subject' : 'Add Subject'">

      <div class="space-y-4">

        <!-- Fixed: matched the bordered/background alert style used on the
             Class Management page instead of a bare red line -->
        <div
          v-if="formError"
          class="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
          {{ formError }}
        </div>

        <div>

          <label class="block text-sm font-medium mb-1">
            Class
          </label>

          <select
            v-model="form.class_id"
            class="input">

            <option value="">
              Select Class
            </option>

            <option
              v-for="c in classes"
              :key="c.id"
              :value="c.id" >
              {{ c.class_name }} - {{ c.section }}
            </option>

          </select>

        </div>

        <div>

          <label class="block text-sm font-medium mb-1">
            Subject Name
          </label>

          <input
            v-model="form.subject_name"
            class="input">

        </div>

        <div>

          <label class="block text-sm font-medium mb-1">
            Subject Code
          </label>

          <input
            v-model="form.subject_code"
            class="input" >

        </div>

        <div>

          <label class="block text-sm font-medium mb-1">
            Teacher Name
          </label>

          <input
            v-model="form.teacher_name"
            class="input" >

        </div>

        <div>

          <label class="block text-sm font-medium mb-1">
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

        <div class="flex justify-end gap-3 pt-4">

          <!-- Fixed: disable Cancel while a save is in flight -->
          <button
            class="btn-secondary"
            :disabled="saving"
            @click="showForm = false">
            Cancel
          </button>

          <!-- Fixed: disable Save + show progress text while saving,
               matching the Class Management page and preventing
               double-submit on a slow network -->
          <button
            class="btn-primary"
            :disabled="saving"
            @click="saveSubject" >
            {{ saving
              ? "Saving..."
              : editingSubject
                ? "Update Subject"
                : "Add Subject"
            }}
          </button>

        </div>

      </div>

    </Modal>

    <!-- Delete Modal -->

    <ConfirmDialog
      v-model="showDelete"
      @confirm="doDelete">

      Delete
      <strong>{{ deletingSubject?.subject_name }}</strong>
      <template v-if="deletingSubject?.class_name">
        from
        <strong>
          {{ deletingSubject.class_name }}
          <template v-if="deletingSubject.section">
            - {{ deletingSubject.section }}
          </template>
        </strong>
      </template>
      ? This action cannot be undone.

    </ConfirmDialog>

  </div>

</template>

<script setup>
const toast = useToast()
const subjects = ref([])
const classes = ref([])

const loading = ref(true)
const saving = ref(false)

const search = ref("")
const statusFilter = ref("")
const classFilter = ref("")

const showForm = ref(false)
const showDelete = ref(false)

const editingSubject = ref(null)
const deletingSubject = ref(null)

const formError = ref("")

const form = ref({
  class_id: "",
  subject_name: "",
  subject_code: "",
  teacher_name: "",
  status: "active"
})

const summary = computed(() => {

  return {

    total: subjects.value.length,

    active: subjects.value.filter(
      s => s.status === "active"
    ).length,

    inactive: subjects.value.filter(
      s => s.status === "inactive"
    ).length

  }

})

const filtered = computed(() => {

  return subjects.value.filter(subject => {

    const keyword = search.value.toLowerCase()

    // Fixed: subject_name had no null/undefined guard while
    // subject_code and teacher_name did. A null subject_name from the
    // API would throw here and blank out the whole table.
    const matchSearch =

      !keyword ||

      (subject.subject_name || "")
        .toLowerCase()
        .includes(keyword) ||

      (subject.subject_code || "")
        .toLowerCase()
        .includes(keyword) ||

      (subject.teacher_name || "")
        .toLowerCase()
        .includes(keyword)

    const matchStatus =

      !statusFilter.value ||

      subject.status === statusFilter.value

    const matchClass =

      !classFilter.value ||

      subject.class_id == classFilter.value

    return (

      matchSearch &&
      matchStatus &&
      matchClass

    )

  })

})

function resetForm() {

  form.value = {

    class_id: "",

    subject_name: "",

    subject_code: "",

    teacher_name: "",

    status: "active"

  }

  editingSubject.value = null

  formError.value = ""

}

function openAdd() {

  resetForm()

  showForm.value = true

}

function openEdit(subject) {

  editingSubject.value = subject

  form.value = {

    class_id: subject.class_id,

    subject_name: subject.subject_name,

    subject_code: subject.subject_code,

    teacher_name: subject.teacher_name,

    status: subject.status

  }

  formError.value = ""

  showForm.value = true

}

function confirmDelete(subject) {

  deletingSubject.value = subject

  showDelete.value = true

}


async function fetchSubjects() {

  loading.value = true

  try {

    subjects.value = await $fetch("/api/subjects")

  } catch (error) {

    console.error(error)

    subjects.value = []

  } finally {

    loading.value = false

  }

}

async function fetchClasses() {

  try {

    classes.value = await $fetch("/api/classes")

  } catch (error) {

    console.error(error)

    classes.value = []

  }

}

async function saveSubject() {

  formError.value = ""

  if (
    !form.value.class_id ||
    !form.value.subject_name
  ) {

   toast.error("Class and Subject Name are required.")
return

  }

  saving.value = true

  try {

    const payload = {

      class_id: Number(form.value.class_id),

      subject_name: form.value.subject_name,

      subject_code: form.value.subject_code,

      teacher_name: form.value.teacher_name,

      status: form.value.status

    }

    if (editingSubject.value) {

      await $fetch(

        `/api/subjects/${editingSubject.value.id}`,

        {

          method: "PUT",

          body: payload

        }

      )

    } else {

      await $fetch(

        "/api/subjects",

        {

          method: "POST",

          body: payload

        }

      )

    }

    showForm.value = false

    await fetchSubjects()
if (editingSubject.value) {
  toast.success("Subject updated successfully.")
} else {
  toast.success("Subject added successfully.")
}
  } catch (error) {

    console.error(error)
formError.value = "Unable to save subject."
toast.error("Unable to save subject.")

  } finally {

    saving.value = false

  }

}

async function doDelete() {

  if (!deletingSubject.value)
    return

  try {

    await $fetch(

      `/api/subjects/${deletingSubject.value.id}`,

      {

        method: "DELETE"

      }

    )

    showDelete.value = false

    deletingSubject.value = null

    await fetchSubjects()
toast.success("Subject deleted successfully.")
  } catch (error) {

    console.error(error)

  }

}

onMounted(async () => {

  await Promise.all([

    fetchSubjects(),

    fetchClasses()

  ])

})
</script>
