<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-xl font-bold text-slate-900">Fee Management</h1>
        <p class="text-sm text-slate-500 mt-0.5">Track and manage student fees & payments</p>
      </div>

    
      <button class="btn-primary" @click="openAdd"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4"/>
      </svg>Add Fee</button>
    </div>

    <!-- Summary -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
        <div class="flex items-center gap-3 mb-3"><div class="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
        </svg>
      </div>
      <p class="text-sm font-medium text-slate-500">Total Billed</p>
    </div>
        <p class="text-3xl font-bold text-slate-900 tracking-tight">{{ formatCurrency(summary.total) }}</p>
      </div>


      <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 relative overflow-hidden">
        <div class="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full -mr-8 -mt-8">

        </div>
        <div class="relative">
          <div class="flex items-center gap-3 mb-3">
            <div class="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
              </svg>
            </div>

          

            <p class="text-sm font-medium text-slate-500">Total Collected</p>
          </div>
          <p class="text-3xl font-bold text-emerald-700 tracking-tight">{{ formatCurrency(summary.collected) }}</p>
        </div>
      </div>

      <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 relative overflow-hidden">
        <div class="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full -mr-8 -mt-8">
        </div>


        <div class="relative">
          <div class="flex items-center gap-3 mb-3">
            <div class="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              </div>

              <p class="text-sm font-medium text-slate-500">Total Pending</p>
            </div>
            <p class="text-3xl font-bold text-amber-700 tracking-tight">{{ formatCurrency(summary.pending) }}</p>
          </div>
      </div>


      <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 relative overflow-hidden">
        <div class="absolute top-0 right-0 w-24 h-24 bg-red-500/5 rounded-full -mr-8 -mt-8">
        </div>


        <div class="relative">
          <div class="flex items-center gap-3 mb-3">
            <div class="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
              </div>

              <p class="text-sm font-medium text-slate-500">Overdue</p>
            </div>

            <p class="text-3xl font-bold text-red-700 tracking-tight">{{ formatCurrency(summary.overdue) }}</p>
          </div>

      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div class="relative">
          <svg class="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          <input v-model="search" type="text" placeholder="Search by student or fee..." class="input pl-10">
        </div>
        <select v-model="statusFilter" class="input"><option value="">All Statuses</option>
          <option value="unpaid">Unpaid</option>
          <option value="partial">Partial</option>
            <option value="paid">Paid</option>
            <option value="overdue">Overdue</option>
          </select>
      </div>
    </div>

    <!-- Fees -->
    <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div v-if="loading" class="p-6 space-y-4">
        <div v-for="i in 5" :key="i" class="flex items-center gap-4">
          <div class="flex-1 space-y-1.5">
            <div class="h-3 w-32 bg-slate-200 rounded animate-pulse">

          </div>
          <div class="h-2.5 w-20 bg-slate-200 rounded animate-pulse">

          </div>
        </div>
        <div class="h-3 w-20 bg-slate-200 rounded animate-pulse">

        </div>
        <div class="h-6 w-16 rounded-full bg-slate-200 animate-pulse">

        </div>
      </div>
      </div>


      <div v-else-if="filtered.length === 0">
        <EmptyState message="No fees found. Add a fee record to get started.">
          <template #action><button class="btn-primary" @click="openAdd">Add Fee</button>
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
                <th class="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Title</th>
                <th class="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Amount</th>
                <th class="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Paid</th>
                <th class="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Due Date</th>
                <th class="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                <th class="px-5 py-3.5 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>

            <tbody class="divide-y divide-slate-100">
              <tr v-for="f in filtered" :key="f.id" class="hover:bg-slate-50 transition-colors">
                <td class="px-5 py-3.5 font-semibold text-slate-900 whitespace-nowrap">{{ studentName(f) }}</td>
                <td class="px-5 py-3.5 text-slate-600">{{ f.title }}</td>
                <td class="px-5 py-3.5 font-semibold text-slate-900">{{ formatCurrency(f.amount) }}</td>
                <td class="px-5 py-3.5"><span class="text-emerald-700 font-semibold">{{ formatCurrency(f.paid_amount) }}</span></td>
                <td class="px-5 py-3.5" :class="isOverdue(f) ? 'text-red-600 font-semibold' : 'text-slate-600'">{{ formatDate(f.due_date) }}</td>
                <td class="px-5 py-3.5"><span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold" :class="statusBadge(f)"><span class="w-1.5 h-1.5 rounded-full" :class="statusDot(f)"></span>{{ statusLabel(f) }}</span>
                  </td>

                <td class="px-5 py-3.5">
                  <div class="flex items-center justify-end gap-1">
                    <button v-if="f.status !== 'paid'" class="btn-success btn-sm" @click="openPayment(f)">
                      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/>
                      </svg>Payment</button>

                    <ActionIconButton icon="edit" label="Edit fee" @click="openEdit(f)" />
                    <ActionIconButton icon="delete" label="Delete fee" @click="confirmDelete(f)" />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>


        <!-- Mobile stacked cards -->
        <div class="md:hidden divide-y divide-slate-100">
          <div v-for="f in filtered" :key="f.id" class="p-4 space-y-3">
            <div class="flex items-start justify-between gap-3">
              <div class="min-w-0">
                <p class="font-semibold text-slate-900 truncate">{{ studentName(f) }}</p>
                <p class="text-xs text-slate-500 mt-0.5">{{ f.title }}</p>
              </div>

              <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold shrink-0" :class="statusBadge(f)"><span class="w-1.5 h-1.5 rounded-full" :class="statusDot(f)"></span>{{ statusLabel(f) }}</span>
            </div>


            <div class="flex items-center justify-between text-sm">
              <span class="text-slate-500">{{ formatCurrency(f.paid_amount) }} of {{ formatCurrency(f.amount) }}</span>
              <span :class="isOverdue(f) ? 'text-red-600 font-semibold' : 'text-slate-500'">Due {{ formatDate(f.due_date) }}</span>
            </div>

            <div class="flex items-center gap-2 pt-1">
              <button v-if="f.status !== 'paid'" class="btn-success btn-sm flex-1 justify-center" @click="openPayment(f)">Record Payment</button>
              <ActionIconButton icon="edit" label="Edit fee" @click="openEdit(f)" />
              <ActionIconButton icon="delete" label="Delete fee" @click="confirmDelete(f)" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add/Edit Modal -->
    <Modal v-model="showForm" :title="editingFee ? 'Edit Fee' : 'Add New Fee'">
      <div class="space-y-4">
        <div v-if="formError" class="p-3.5 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700 flex items-center gap-2">
          <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
          </svg>{{ formError }}
        </div>


        <div>
          <label class="block text-sm font-semibold text-slate-700 mb-1.5">Student
             <span class="text-red-500">*</span></label><select v-model="form.student_id" class="input" :disabled="!!editingFee"><option value="">Select student...</option><option v-for="s in students" :key="s.id" :value="s.id">{{ s.first_name }} {{ s.last_name }} ({{ s.class || 'No class' }})</option>
            </select>
          </div>

        <div>
          <label class="block text-sm font-semibold text-slate-700 mb-1.5">Fee Title <span class="text-red-500">*</span>
          </label>
          <input v-model="form.title" class="input" placeholder="e.g. Tuition Q1">
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1.5">Amount <span class="text-red-500">*</span>
            </label>
            <input v-model="form.amount" type="number" step="0.01" class="input" placeholder="500.00">
          </div>


          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1.5">Due Date</label>
            <input v-model="form.due_date" type="date" class="input"></div>
          </div>


        <div>
          <label class="block text-sm font-semibold text-slate-700 mb-1.5">Note</label>
          <textarea v-model="form.note" class="input" rows="2"></textarea>
        </div>


        <div class="flex justify-end gap-3 pt-4 border-t border-slate-100 -mx-6 px-6 -mb-5 pb-5 mt-6">
          <button class="btn-secondary" @click="showForm = false">Cancel</button>
          <button class="btn-primary" :disabled="saving" @click="saveFee">{{ saving ? 'Saving...' : (editingFee ? 'Update Fee' : 'Add Fee') }}</button>
        </div>
      </div>
    </Modal>

    <!-- Payment Modal -->
    <Modal v-model="showPayment" title="Record Payment">
      <div v-if="paymentFee" class="space-y-5">
        <div class="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
          <div class="flex justify-between text-sm py-1">
            <span class="text-slate-500">Student</span>
            <span class="font-semibold text-slate-900">{{ studentName(paymentFee) }}</span>
          </div>

          <div class="flex justify-between text-sm py-1">
            <span class="text-slate-500">Fee</span>
            <span class="font-semibold text-slate-900">{{ paymentFee.title }}</span>
          </div>

          <div class="flex justify-between text-sm py-1">
            <span class="text-slate-500">Total</span>
            <span class="font-semibold text-slate-900">{{ formatCurrency(paymentFee.amount) }}</span>
          </div>

          <div class="flex justify-between text-sm py-1">
            <span class="text-slate-500">Paid</span>
            <span class="font-semibold text-emerald-700">{{ formatCurrency(paymentFee.paid_amount) }}</span>
          </div>

          <div class="flex justify-between text-sm py-2 mt-1 pt-2 border-t border-slate-200">
            <span class="text-slate-600 font-semibold">Remaining after this payment</span>
            <span class="font-bold text-base" :class="remainingAfterPayment < 0 ? 'text-red-700' : 'text-amber-700'">{{ formatCurrency(Math.max(remainingAfterPayment, 0)) }}</span>
          </div>
        </div>

        <div v-if="paymentError" class="p-3.5 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700 flex items-center gap-2">
          <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
          </svg>{{ paymentError }}</div>

        <div class="grid grid-cols-2 gap-4">
          <div><label class="block text-sm font-semibold text-slate-700 mb-1.5">Amount</label>
            <input v-model="paymentForm.paid_amount" type="number" step="0.01" class="input">
          </div>

          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1.5">Method</label>
            <select v-model="paymentForm.payment_method" class="input">
              <option value="cash">Cash</option>
              <option value="card">Card</option>
              <option value="bank_transfer">Bank Transfer</option>
              <option value="check">Check</option>
              <option value="online">Online</option>
            </select>
          </div>
        </div>

        <div>
          <label class="block text-sm font-semibold text-slate-700 mb-1.5">Date</label>
          <input v-model="paymentForm.paid_date" type="date" class="input">
        </div>
        <div class="flex justify-end gap-3 pt-4 border-t border-slate-100 -mx-6 px-6 -mb-5 pb-5 mt-6">
          <button class="btn-secondary" @click="showPayment = false">Cancel</button>
          <button class="btn-success" :disabled="saving" @click="recordPayment">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
            </svg>{{ saving ? 'Recording...' : 'Record Payment' }}</button>
            </div>
      </div>

    </Modal>

    <ConfirmDialog v-model="showDelete" @confirm="doDelete">Delete the {{ deletingFee?.title }} fee for {{ deletingFee ? studentName(deletingFee) : '' }}? This action cannot be undone.</ConfirmDialog>
  </div>

</template>


<script setup>
const toast = useToast()
const fees = ref([])
const students = ref([])

const loading = ref(true)
const saving = ref(false)

const search = ref("")
const statusFilter = ref("")

const showForm = ref(false)
const showPayment = ref(false)
const showDelete = ref(false)

const editingFee = ref(null)
const deletingFee = ref(null)
const paymentFee = ref(null)

const formError = ref("")
const paymentError = ref("")

const form = ref({
  student_id: "",
  title: "",
  amount: "",
  due_date: "",
  note: ""
})

const paymentForm = ref({
  paid_amount: "",
  payment_method: "cash",
  paid_date: new Date().toISOString().split("T")[0]
})

const today = new Date().toISOString().split("T")[0]

const formatCurrency = (value) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2
  }).format(Number(value || 0))
}

const formatDate = (date) => {
  if (!date) return "—"

  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  })
}

const studentName = (fee) => {
  return `${fee.first_name || ""} ${fee.last_name || ""}`
}

const isOverdue = (fee) => {
  return (
    fee.status !== "paid" &&
    fee.due_date &&
    fee.due_date < today
  )
}

const statusBadge = (fee) => {
  if (isOverdue(fee))
    return "bg-red-50 text-red-700"

  if (fee.status === "paid")
    return "bg-emerald-50 text-emerald-700"

  if (fee.status === "partial")
    return "bg-amber-50 text-amber-700"

  return "bg-slate-100 text-slate-600"
}

const statusDot = (fee) => {
  if (isOverdue(fee))
    return "bg-red-500"

  if (fee.status === "paid")
    return "bg-emerald-500"

  if (fee.status === "partial")
    return "bg-amber-500"

  return "bg-slate-400"
}

const statusLabel = (fee) => {
  return isOverdue(fee) ? "overdue" : fee.status
}

const summary = computed(() => {
  const total = fees.value.reduce(
    (sum, fee) => sum + Number(fee.amount),
    0
  )

  const collected = fees.value.reduce(
    (sum, fee) => sum + Number(fee.paid_amount),
    0
  )

  const overdue = fees.value
    .filter(isOverdue)
    .reduce(
      (sum, fee) =>
        sum + (Number(fee.amount) - Number(fee.paid_amount)),
      0
    )

  return {
    total,
    collected,
    pending: total - collected,
    overdue
  }
})

const filtered = computed(() => {
  return fees.value.filter((fee) => {

    const keyword = search.value.toLowerCase()

    const name =
      `${fee.first_name || ""} ${fee.last_name || ""}`.toLowerCase()

    const searchMatch =
      !keyword ||
      name.includes(keyword) ||
      fee.title.toLowerCase().includes(keyword)

    const statusMatch =
      !statusFilter.value ||
      (
        statusFilter.value === "overdue"
          ? isOverdue(fee)
          : fee.status === statusFilter.value
      )

    return searchMatch && statusMatch
  })
})

const resetForm = () => {
  form.value = {
    student_id: "",
    title: "",
    amount: "",
    due_date: "",
    note: ""
  }

  editingFee.value = null
  formError.value = ""
}

const openAdd = () => {
  resetForm()
  showForm.value = true
}

const openEdit = (fee) => {
  editingFee.value = fee

  form.value = {
    student_id: fee.student_id,
    title: fee.title,
    amount: String(fee.amount),
    due_date: fee.due_date || "",
    note: fee.note || ""
  }

  formError.value = ""
  showForm.value = true
}

const computeStatus = (amount, paid) => {
  if (paid <= 0) return "unpaid"
  if (paid >= amount) return "paid"
  return "partial"
}

const saveFee = async () => {
  formError.value = ""

  if (
    !form.value.student_id ||
    !form.value.title ||
    !form.value.amount
  ) {
  formError.value = "Student, Title and Amount are required."
toast.error("Student, Title and Amount are required.")
return
  }

  saving.value = true

  try {
    const payload = {
      student_id: form.value.student_id,
      title: form.value.title,
      amount: Number(form.value.amount),
      due_date: form.value.due_date || null,
      note: form.value.note || null
    }

    if (editingFee.value) {

      await $fetch(`/api/fees/${editingFee.value.id}`, {
        method: "PUT",
        body: payload
      })

    } else {

      await $fetch("/api/fees", {
        method: "POST",
        body: {
          ...payload,
          paid_amount: 0,
          status: "unpaid"
        }
      })

    }

 const isEdit = !!editingFee.value

showForm.value = false
resetForm()

await fetchFees()

if (isEdit) {
  toast.success("Fee updated successfully.")
} else {
  toast.success("Fee added successfully.")
}

  

  } catch (error) {
    console.error(error)
  formError.value = "Unable to save fee."
toast.error("Unable to save fee.")
  } finally {
    saving.value = false
  }
}

const openPayment = (fee) => {

  paymentFee.value = fee

  paymentForm.value = {
    paid_amount: String(
      Number(fee.amount) - Number(fee.paid_amount)
    ),
    payment_method: fee.payment_method || "cash",
    paid_date: new Date().toISOString().split("T")[0]
  }

  paymentError.value = ""
  showPayment.value = true
}

const remainingAfterPayment = computed(() => {

  if (!paymentFee.value) return 0

  const amount =
    parseFloat(paymentForm.value.paid_amount) || 0

  return (
    Number(paymentFee.value.amount) -
    Number(paymentFee.value.paid_amount) -
    amount
  )
})

const recordPayment = async () => {

  if (!paymentFee.value) return

  const amount =
    parseFloat(paymentForm.value.paid_amount)

if (!amount || amount <= 0) {
  paymentError.value = "Enter a valid payment amount."
  toast.error("Enter a valid payment amount.")
  return
}

  const balance =
    Number(paymentFee.value.amount) -
    Number(paymentFee.value.paid_amount)

if (amount > balance) {
  paymentError.value =
    `Amount exceeds remaining balance (${formatCurrency(balance)})`

  toast.error(`Amount exceeds remaining balance (${formatCurrency(balance)})`)
  return
}

  saving.value = true

  try {

    const newPaid =
      Number(paymentFee.value.paid_amount) + amount

    const newStatus =
      computeStatus(
        Number(paymentFee.value.amount),
        newPaid
      )

    await $fetch(
      `/api/fees/payment/${paymentFee.value.id}`,
      {
        method: "PUT",
        body: {
          paid_amount: newPaid,
          status: newStatus,
          paid_date:
            newStatus === "paid"
              ? paymentForm.value.paid_date
              : null,
          payment_method:
            paymentForm.value.payment_method
        }
      }
    )

    showPayment.value = false

    await fetchFees()
    toast.success("Payment recorded successfully.")

  } catch (error) {
    console.error(error)
  paymentError.value = "Unable to record payment."
toast.error("Unable to record payment.")
  } finally {
    saving.value = false
  }
}

const confirmDelete = (fee) => {
  deletingFee.value = fee
  showDelete.value = true
}
const doDelete = async () => {
  if (!deletingFee.value) return

  try {
    await $fetch(`/api/fees/${deletingFee.value.id}`, {
      method: "DELETE"
    })

    showDelete.value = false
    deletingFee.value = null

    await fetchFees()
toast.success("Fee deleted successfully.")
  } catch (error) {
  console.error(error)
  fees.value = []
  toast.error("Failed to load fees.")
}
}

async function fetchFees() {
  loading.value = true

  try {
    fees.value = await $fetch("/api/fees")
  } catch (error) {
    console.error(error)
    fees.value = []
  } finally {
    loading.value = false
  }
}

async function fetchStudents() {
  try {
    students.value = await $fetch("/api/students")
  } catch (error) {
    console.error(error)
    students.value = []
  }
}

onMounted(async () => {
  await fetchStudents()
  await fetchFees()
})
</script>
