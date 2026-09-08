<template>
  <main class="p-4 lg:p-6 flex flex-col gap-6 w-full max-w-7xl mx-auto">
    <!-- Header with primary action -->
    <header class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-2 dark:border-dark-3 pb-5">
      <div>
        <div class="flex items-center gap-3">
          <h1 class="text-1.5rem font-bold typo-clr-base tracking-tight font-sans">Customer Intelligence</h1>
          <span class="px-2.5 py-0.5 text-11px font-mono uppercase tracking-wider rounded-full surface-2 border border-gray-2 dark:border-dark-3 typo-clr-muted">
            Directory & CRM
          </span>
        </div>
        <p class="typo-sm typo-clr-muted mt-1">Client accounts, lifetime order history, contact records, and account verification</p>
      </div>
      <button
        type="button"
        @click="ModalRef?.openModal"
        class="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-md fill-primary-2 typo-clr-on-primary font-medium typo-sm hover:fill-primary-3 active:scale-97 transition shadow-xs cursor-pointer focus:outline-none focus-visible:(ring-2 ring-indigo-5 dark:ring-violet-5)"
      >
        <IAdd width="16" height="16" />
        <span>New Customer</span>
      </button>
    </header>

    <!-- Audience Command Strip (Not generic cards) -->
    <section class="surface-1 rounded-lg border border-gray-2 dark:border-dark-3 p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-6 shadow-xs">
      <!-- Audience Status Segment Tabs -->
      <div class="flex flex-wrap items-center gap-2">
        <button
          type="button"
          @click="selectStatusFilter('all')"
          :class="[
            selectedStatus === 'all'
              ? 'fill-primary-2 typo-clr-on-primary font-semibold shadow-xs'
              : 'surface-2 typo-clr-base hover:border-gray-3 dark:hover:border-dark-2'
          ]"
          class="px-3.5 py-1.5 rounded-md text-xs transition-all duration-150 active:scale-97 flex items-center gap-2 cursor-pointer border border-transparent"
        >
          <span>All Directory</span>
          <span
            :class="selectedStatus === 'all' ? 'bg-white/20 text-white' : 'surface-1 typo-clr-muted'"
            class="px-1.5 py-0.5 rounded text-10px font-mono tabular-nums"
          >
            {{ allCustomersCount }}
          </span>
        </button>

        <button
          type="button"
          @click="selectStatusFilter('active')"
          :class="[
            selectedStatus === 'active'
              ? 'bg-emerald-600 text-white font-semibold shadow-xs'
              : 'surface-2 typo-clr-base hover:border-emerald-4 dark:hover:border-emerald-6'
          ]"
          class="px-3.5 py-1.5 rounded-md text-xs transition-all duration-150 active:scale-97 flex items-center gap-2 cursor-pointer border border-transparent"
        >
          <span class="w-2 h-2 rounded-full bg-emerald-400" />
          <span>Active Accounts</span>
          <span
            :class="selectedStatus === 'active' ? 'bg-white/20 text-white' : 'surface-1 text-emerald-600 dark:text-emerald-400'"
            class="px-1.5 py-0.5 rounded text-10px font-mono tabular-nums"
          >
            {{ activeCustomersCount }}
          </span>
        </button>

        <button
          type="button"
          @click="selectStatusFilter('suspended')"
          :class="[
            selectedStatus === 'suspended'
              ? 'bg-amber-600 text-white font-semibold shadow-xs'
              : 'surface-2 typo-clr-base hover:border-amber-4 dark:hover:border-amber-6'
          ]"
          class="px-3.5 py-1.5 rounded-md text-xs transition-all duration-150 active:scale-97 flex items-center gap-2 cursor-pointer border border-transparent"
        >
          <span>Suspended</span>
          <span
            :class="selectedStatus === 'suspended' ? 'bg-white/20 text-white' : 'surface-1 text-amber-600 dark:text-amber-400'"
            class="px-1.5 py-0.5 rounded text-10px font-mono tabular-nums"
          >
            {{ suspendedCustomersCount }}
          </span>
        </button>
      </div>

      <!-- Audience Intelligence Signals -->
      <div class="flex items-center gap-6 lg:border-l lg:border-gray-2 dark:lg:border-dark-3 lg:pl-6">
        <div>
          <span class="text-11px font-mono uppercase tracking-wider typo-clr-muted block">Purchasing Base</span>
          <span class="text-base sm:text-lg font-bold font-mono tracking-tight typo-clr-base tabular-nums">
            {{ purchasingCustomersCount }}
            <span class="text-xs font-normal typo-clr-muted">buyers</span>
          </span>
        </div>

        <div>
          <div class="flex items-center justify-between gap-3 mb-1">
            <span class="text-11px font-mono uppercase tracking-wider typo-clr-muted block">Active Ratio</span>
            <span class="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
              {{ retentionRatePct }}
            </span>
          </div>
          <div class="w-24 sm:w-28 h-1.5 rounded-full bg-gray-2 dark:bg-dark-3 overflow-hidden">
            <div
              class="h-full rounded-full bg-emerald-500 transition-all duration-500"
              :style="{ width: retentionRatePct }"
            />
          </div>
        </div>

        <div class="hidden sm:block">
          <span class="text-11px font-mono uppercase tracking-wider typo-clr-muted block">New (30d)</span>
          <span class="text-base sm:text-lg font-bold font-mono tracking-tight typo-clr-base tabular-nums">
            +{{ newCustomersCount }}
          </span>
        </div>
      </div>
    </section>

    <!-- Search Toolbar -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div class="relative flex-1 max-w-md">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none typo-clr-muted">
          <ISearch width="15" height="15" />
        </div>
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Search by name, email, phone, or customer ID..."
          class="w-full pl-9 pr-8 py-2 text-xs sm:text-sm surface-1 border border-gray-2 dark:border-dark-3 rounded-md typo-clr-base placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:border-indigo-5 dark:focus:border-violet-5 transition"
        />
        <button
          v-if="searchQuery"
          type="button"
          @click="searchQuery = ''"
          class="absolute inset-y-0 right-0 pr-2.5 flex items-center typo-clr-muted hover:typo-clr-base text-xs"
        >
          ✕
        </button>
      </div>

      <div class="text-xs typo-clr-muted font-mono self-start sm:self-auto">
        Showing {{ store.customers?.length ?? 0 }} of {{ store.countAll ?? 0 }} accounts
      </div>
    </div>

    <!-- Main Customers Ledger -->
    <div class="surface-1 rounded-lg border border-gray-2 dark:border-dark-3 overflow-hidden shadow-xs flex flex-col min-h-340px">
      <div class="overflow-x-auto overflow-y-hidden grow">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="surface-2 border-b border-gray-2 dark:border-dark-3 text-11px font-mono uppercase tracking-wider typo-clr-muted select-none">
              <th scope="col" class="py-3 px-4 font-medium">Customer Profile</th>
              <th scope="col" class="py-3 px-4 font-medium">Contact Details</th>
              <th scope="col" class="py-3 px-4 font-medium">Member Since</th>
              <th scope="col" class="py-3 px-4 font-medium">Lifetime Orders</th>
              <th scope="col" class="py-3 px-4 font-medium text-right">Lifetime Spend</th>
              <th scope="col" class="py-3 px-4 font-medium">Account Status</th>
              <th scope="col" class="py-3 px-4 font-medium text-right">Actions</th>
            </tr>
          </thead>

          <tbody v-if="store.isLoading" class="divide-y divide-gray-2 dark:divide-dark-3">
            <tr v-for="n in 8" :key="n" class="animate-pulse">
              <td class="py-3 px-4"><div class="h-4 w-36 max-w-full bg-gray-2 dark:bg-dark-3 rounded" /></td>
              <td class="py-3 px-4"><div class="h-4 w-40 max-w-full bg-gray-2 dark:bg-dark-3 rounded" /></td>
              <td class="py-3 px-4"><div class="h-4 w-24 max-w-full bg-gray-2 dark:bg-dark-3 rounded" /></td>
              <td class="py-3 px-4"><div class="h-4 w-16 max-w-full bg-gray-2 dark:bg-dark-3 rounded" /></td>
              <td class="py-3 px-4"><div class="h-4 w-20 max-w-full bg-gray-2 dark:bg-dark-3 rounded ml-auto" /></td>
              <td class="py-3 px-4"><div class="h-4 w-16 max-w-full bg-gray-2 dark:bg-dark-3 rounded-full" /></td>
              <td class="py-3 px-4"><div class="h-4 w-14 max-w-full bg-gray-2 dark:bg-dark-3 rounded ml-auto" /></td>
            </tr>
          </tbody>

          <tbody v-else-if="store.customers && store.customers.length > 0" class="divide-y divide-gray-2 dark:divide-dark-3 text-xs sm:text-sm">
            <tr
              v-for="(customer, idx) in store.customers"
              :key="customer.id"
              class="hover:surface-2 transition-colors duration-150 group animate-row-in"
              :style="{ animationDelay: `${Math.min(idx * 25, 200)}ms` }"
            >
              <!-- Customer Profile -->
              <td class="py-3 px-4">
                <div class="flex items-center gap-3">
                  <div
                    class="w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0 select-none text-white shadow-xs group-hover:scale-105 transition-transform duration-150"
                    :style="{ backgroundColor: getCustomerColor(customer.name || String(customer.id)) }"
                  >
                    {{ getInitials(customer.name || 'User') }}
                  </div>
                  <div class="min-w-0">
                    <div class="flex items-center gap-2">
                      <RouterLink
                        :to="`/customers/${customer.id}`"
                        class="font-bold typo-clr-base hover:text-indigo-600 dark:hover:text-violet-400 truncate transition block"
                      >
                        {{ customer.name ?? 'Customer #' + customer.id }}
                      </RouterLink>
                      <span class="text-10px font-mono px-1.5 py-0.2 rounded surface-2 border border-gray-2 dark:border-dark-3 typo-clr-muted">
                        #{{ customer.id }}
                      </span>
                    </div>
                  </div>
                </div>
              </td>

              <!-- Contact Details -->
              <td class="py-3 px-4">
                <div class="flex flex-col gap-0.5">
                  <a
                    v-if="customer.email"
                    :href="`mailto:${customer.email}`"
                    class="typo-clr-base hover:text-indigo-600 dark:hover:text-violet-400 flex items-center gap-1.5 truncate transition"
                  >
                    <IEmail width="12" height="12" class="typo-clr-muted shrink-0" />
                    <span>{{ customer.email }}</span>
                  </a>
                  <span v-else class="typo-clr-muted text-xs">-</span>
                  <span v-if="customer.phone" class="font-mono text-11px typo-clr-muted tabular-nums">
                    {{ customer.phone }}
                  </span>
                </div>
              </td>

              <!-- Member Since -->
              <td class="py-3 px-4 font-mono text-xs typo-clr-muted tabular-nums whitespace-nowrap">
                {{ formatDate(customer.created_at) }}
              </td>

              <!-- Lifetime Orders -->
              <td class="py-3 px-4 whitespace-nowrap">
                <span class="inline-flex items-center gap-1 font-mono text-xs font-semibold px-2 py-0.5 rounded surface-2 border border-gray-2 dark:border-dark-3 typo-clr-base">
                  {{ customer.ordersCount ?? 0 }} {{ (customer.ordersCount === 1) ? 'order' : 'orders' }}
                </span>
              </td>

              <!-- Lifetime Spend -->
              <td class="py-3 px-4 text-right font-mono font-bold typo-clr-base tabular-nums whitespace-nowrap">
                ${{ Number(customer.totalSpent ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}
              </td>

              <!-- Status with One-Click Toggle -->
              <td class="py-3 px-4 whitespace-nowrap">
                <button
                  type="button"
                  @click="toggleCustomerStatus(customer.id)"
                  class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-11px font-medium capitalize transition-all duration-150 active:scale-95 cursor-pointer border focus:outline-none"
                  :class="customer.status
                    ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20'
                    : 'bg-amber-500/10 text-amber-800 dark:text-amber-400 border-amber-500/20 hover:bg-amber-500/20'"
                  :title="customer.status ? 'Click to suspend customer' : 'Click to activate customer'"
                >
                  <span
                    class="w-1.5 h-1.5 rounded-full"
                    :class="customer.status ? 'bg-emerald-500' : 'bg-amber-500'"
                  />
                  <span>{{ customer.status ? 'Active' : 'Suspended' }}</span>
                </button>
              </td>

              <!-- Actions -->
              <td class="py-3 px-4 text-right whitespace-nowrap">
                <div class="flex items-center justify-end gap-1.5">
                  <RouterLink
                    to="/chat"
                    class="p-1.5 rounded surface-2 hover:surface-3 border border-gray-2 dark:border-dark-3 text-indigo-600 dark:text-violet-400 transition-all duration-150 active:scale-95"
                    title="Send message to customer"
                  >
                    <IMessage width="14" height="14" />
                  </RouterLink>
                  <RouterLink
                    :to="`/customers/${customer.id}`"
                    class="inline-flex items-center gap-1 px-2.5 py-1 rounded surface-2 hover:surface-3 border border-gray-2 dark:border-dark-3 text-indigo-600 dark:text-violet-400 text-xs font-medium transition-all duration-150 active:scale-95"
                    title="View full customer profile"
                  >
                    <IEye width="13" height="13" />
                    <span>Profile</span>
                  </RouterLink>
                </div>
              </td>
            </tr>
          </tbody>

          <!-- Empty State -->
          <tbody v-else>
            <tr>
              <td colspan="7" class="py-14 text-center">
                <div class="flex flex-col items-center justify-center max-w-sm mx-auto">
                  <div class="w-12 h-12 rounded-full surface-2 flex items-center justify-center typo-clr-muted mb-3">
                    <ICustomers width="22" height="22" />
                  </div>
                  <h3 class="text-base font-bold typo-clr-base">No customers found</h3>
                  <p class="typo-sm typo-clr-muted mt-1 mb-4">
                    {{ searchQuery || selectedStatus !== 'all'
                      ? 'No customer records match your filter criteria.'
                      : 'Your customer directory is currently empty.' }}
                  </p>
                  <button
                    v-if="searchQuery || selectedStatus !== 'all'"
                    type="button"
                    @click="resetFilters"
                    class="px-3 py-1.5 rounded-md surface-2 typo-clr-base text-xs font-medium hover:surface-3 transition border border-gray-2 dark:border-dark-3 cursor-pointer"
                  >
                    Reset Filters
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination Footer -->
      <footer class="border-t border-gray-2 dark:border-dark-3 p-3 sm:px-5 flex flex-wrap items-center justify-between gap-3 text-xs typo-clr-muted surface-2/50 mt-auto">
        <div class="flex items-center gap-2">
          <span>Showing</span>
          <span class="font-mono font-bold typo-clr-base tabular-nums">
            {{ store.customers?.length ?? 0 }}
          </span>
          <span>of</span>
          <span class="font-mono font-bold typo-clr-base tabular-nums">
            {{ store.countAll ?? 0 }}
          </span>
          <span>customers</span>
        </div>

        <div class="flex items-center gap-2">
          <button
            type="button"
            :disabled="currentPage <= 1"
            @click="changePage(currentPage - 1)"
            class="px-2.5 py-1 rounded surface-1 border border-gray-2 dark:border-dark-3 typo-clr-base disabled:opacity-30 disabled:pointer-events-none hover:surface-2 transition cursor-pointer"
          >
            Previous
          </button>
          <span class="font-mono tabular-nums px-1">
            Page {{ currentPage }} of {{ maxPages }}
          </span>
          <button
            type="button"
            :disabled="currentPage >= maxPages"
            @click="changePage(currentPage + 1)"
            class="px-2.5 py-1 rounded surface-1 border border-gray-2 dark:border-dark-3 typo-clr-base disabled:opacity-30 disabled:pointer-events-none hover:surface-2 transition cursor-pointer"
          >
            Next
          </button>
        </div>
      </footer>
    </div>

    <!-- Create Customer Dialog -->
    <CreateCustomerModal @success="refreshData" ref="ModalRef" />
  </main>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useCustomersStore } from '~/store/customers'
import CreateCustomerModal from '~/components/CreateCustomerModal.vue'
import { IAdd, ISearch, ICustomers, IEmail, IEye, IMessage } from '~/components/icons'

const ModalRef = ref<InstanceType<typeof CreateCustomerModal> | null>(null)
const store = useCustomersStore()

const selectedStatus = ref<'all' | 'active' | 'suspended'>('all')
const searchQuery = ref('')
const currentPage = ref(1)
const itemsPerPage = 10

const allCustomersCount = computed(() => store.metrics?.total ?? store.countAll ?? store.customers?.length ?? 0)
const activeCustomersCount = computed(() => store.metrics?.active ?? store.customers?.filter(c => c.status).length ?? 0)
const suspendedCustomersCount = computed(() => store.metrics?.suspended ?? store.customers?.filter(c => !c.status).length ?? 0)
const purchasingCustomersCount = computed(() => store.metrics?.purchasing ?? 0)
const newCustomersCount = computed(() => store.metrics?.newCustomers ?? 0)

const retentionRatePct = computed(() => {
  const total = allCustomersCount.value
  if (!total) return '0%'
  const active = activeCustomersCount.value
  return `${Math.round((active / total) * 100)}%`
})

const maxPages = computed(() => Math.max(1, Math.ceil((store.countAll ?? 0) / itemsPerPage)))

async function fetchCustomers() {
  await store.getCustomers({
    orderOptions: { column: 'id', ascending: false, foreignTable: '' },
    page: currentPage.value,
    itemsPerPage,
    filter: {
      status: selectedStatus.value === 'all' ? 'all' : selectedStatus.value === 'active',
      query: searchQuery.value,
    },
  })
}

function selectStatusFilter(status: 'all' | 'active' | 'suspended') {
  selectedStatus.value = status
  currentPage.value = 1
  fetchCustomers()
}

watch(searchQuery, () => {
  currentPage.value = 1
  fetchCustomers()
})

function changePage(page: number) {
  if (page < 1 || page > maxPages.value) return
  currentPage.value = page
  fetchCustomers()
}

function resetFilters() {
  selectedStatus.value = 'all'
  searchQuery.value = ''
  currentPage.value = 1
  fetchCustomers()
}

async function toggleCustomerStatus(id: number) {
  await store.toggleCustomerStatus(id)
  await fetchCustomers()
}

function refreshData() {
  fetchCustomers()
  store.getMetrics()
}

function formatDate(dateStr?: string | null) {
  if (!dateStr) return '-'
  const d = new Date(dateStr)
  return isNaN(d.getTime()) ? dateStr : d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/)
  if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
  return name.slice(0, 2).toUpperCase()
}

function getCustomerColor(name: string) {
  const palette = ['#4f46e5', '#0284c7', '#0d9488', '#059669', '#d97706', '#dc2626', '#7c3aed', '#db2777']
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return palette[Math.abs(hash) % palette.length]
}

onMounted(() => {
  refreshData()
})
</script>
