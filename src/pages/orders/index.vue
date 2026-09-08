<template>
  <main class="p-4 lg:p-6 flex flex-col gap-6 w-full max-w-7xl mx-auto">
    <!-- Header with primary action -->
    <header class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-2 dark:border-dark-3 pb-5">
      <div>
        <div class="flex items-center gap-3">
          <h1 class="text-1.5rem font-bold typo-clr-base tracking-tight font-sans">Order Fulfillment</h1>
          <span class="px-2.5 py-0.5 text-11px font-mono uppercase tracking-wider rounded-full surface-2 border border-gray-2 dark:border-dark-3 typo-clr-muted">
            Live Pipeline
          </span>
        </div>
        <p class="typo-sm typo-clr-muted mt-1">Dispatch tracking, multi-channel fulfillment triage, and settlement history</p>
      </div>
      <button
        type="button"
        @click="orderDialogRef?.openModal"
        class="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-md fill-primary-2 typo-clr-on-primary font-medium typo-sm hover:fill-primary-3 active:scale-97 transition shadow-xs cursor-pointer focus:outline-none focus-visible:(ring-2 ring-indigo-5 dark:ring-violet-5)"
      >
        <IAdd width="16" height="16" />
        <span>Create Order</span>
      </button>
    </header>

    <!-- Fulfillment Command Strip (Not generic cards) -->
    <section class="surface-1 rounded-lg border border-gray-2 dark:border-dark-3 p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-6 shadow-xs">
      <!-- Pipeline Status Tabs -->
      <div class="flex flex-wrap items-center gap-2">
        <button
          type="button"
          @click="selectStatusFilter('all')"
          :class="[
            selectedStatus === 'all'
              ? 'fill-primary-2 typo-clr-on-primary font-semibold shadow-xs'
              : 'surface-2 typo-clr-base hover:border-gray-3 dark:hover:border-dark-2'
          ]"
          class="px-3.5 py-1.5 rounded-md text-xs transition flex items-center gap-2 cursor-pointer border border-transparent"
        >
          <span>All Orders</span>
          <span
            :class="selectedStatus === 'all' ? 'bg-white/20 text-white' : 'surface-1 typo-clr-muted'"
            class="px-1.5 py-0.5 rounded text-10px font-mono tabular-nums"
          >
            {{ store.countAll ?? 0 }}
          </span>
        </button>

        <button
          type="button"
          @click="selectStatusFilter('pending')"
          :class="[
            selectedStatus === 'pending'
              ? 'bg-amber-500 text-white font-semibold shadow-xs'
              : 'surface-2 typo-clr-base hover:border-amber-4 dark:hover:border-amber-6'
          ]"
          class="px-3.5 py-1.5 rounded-md text-xs transition-all duration-150 active:scale-97 flex items-center gap-2 cursor-pointer border border-transparent"
        >
          <span class="w-2 h-2 rounded-full bg-amber-400 animate-pulse-subtle" />
          <span>Pending Dispatch</span>
          <span
            :class="selectedStatus === 'pending' ? 'bg-white/25 text-white' : 'surface-1 text-amber-600 dark:text-amber-400'"
            class="px-1.5 py-0.5 rounded text-10px font-mono tabular-nums font-semibold"
          >
            {{ store.metrics?.pendingCount ?? 0 }}
          </span>
        </button>

        <button
          type="button"
          @click="selectStatusFilter('completed')"
          :class="[
            selectedStatus === 'completed'
              ? 'bg-emerald-600 text-white font-semibold shadow-xs'
              : 'surface-2 typo-clr-base hover:border-emerald-4 dark:hover:border-emerald-6'
          ]"
          class="px-3.5 py-1.5 rounded-md text-xs transition flex items-center gap-2 cursor-pointer border border-transparent"
        >
          <ICheckCircle width="12" height="12" />
          <span>Completed</span>
          <span
            :class="selectedStatus === 'completed' ? 'bg-white/20 text-white' : 'surface-1 text-emerald-600 dark:text-emerald-400'"
            class="px-1.5 py-0.5 rounded text-10px font-mono tabular-nums"
          >
            {{ store.metrics?.completedCount ?? 0 }}
          </span>
        </button>

        <button
          type="button"
          @click="selectStatusFilter('canceled')"
          :class="[
            selectedStatus === 'canceled'
              ? 'bg-rose-600 text-white font-semibold shadow-xs'
              : 'surface-2 typo-clr-base hover:border-rose-4 dark:hover:border-rose-6'
          ]"
          class="px-3.5 py-1.5 rounded-md text-xs transition flex items-center gap-2 cursor-pointer border border-transparent"
        >
          <span>Canceled</span>
          <span
            :class="selectedStatus === 'canceled' ? 'bg-white/20 text-white' : 'surface-1 text-rose-500'"
            class="px-1.5 py-0.5 rounded text-10px font-mono tabular-nums"
          >
            {{ store.metrics?.cancelledCount ?? 0 }}
          </span>
        </button>
      </div>

      <!-- Financial & Dispatch Signals -->
      <div class="flex items-center gap-6 lg:border-l lg:border-gray-2 dark:lg:border-dark-3 lg:pl-6">
        <div>
          <span class="text-11px font-mono uppercase tracking-wider typo-clr-muted block">Gross Volume</span>
          <span class="text-base sm:text-lg font-bold font-mono tracking-tight typo-clr-base tabular-nums">
            {{ formattedTotalRevenue }}
          </span>
        </div>

        <div>
          <div class="flex items-center justify-between gap-3 mb-1">
            <span class="text-11px font-mono uppercase tracking-wider typo-clr-muted block">Fulfillment</span>
            <span class="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
              {{ fulfillmentRatePct }}%
            </span>
          </div>
          <div class="w-24 sm:w-28 h-1.5 rounded-full bg-gray-2 dark:bg-dark-3 overflow-hidden">
            <div
              class="h-full rounded-full bg-emerald-500 transition-all duration-500"
              :style="{ width: `${Math.min(100, Math.max(0, fulfillmentRatePct))}%` }"
            />
          </div>
        </div>

        <div class="hidden sm:block">
          <span class="text-11px font-mono uppercase tracking-wider typo-clr-muted block">Average Ticket</span>
          <span class="text-base sm:text-lg font-bold font-mono tracking-tight typo-clr-base tabular-nums">
            {{ formattedAOV }}
          </span>
        </div>
      </div>
    </section>

    <!-- Operational Filter & Search Toolbar -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <!-- Search Input -->
      <div class="relative flex-1 max-w-md">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none typo-clr-muted">
          <ISearch width="15" height="15" />
        </div>
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Filter by tracking #, customer name, or notes..."
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

      <!-- Type Filter Buttons -->
      <div class="flex items-center gap-1.5 self-start sm:self-auto surface-1 p-1 rounded-md border border-gray-2 dark:border-dark-3">
        <button
          type="button"
          @click="selectedType = 'all'"
          :class="selectedType === 'all' ? 'surface-2 typo-clr-base font-medium shadow-xs' : 'typo-clr-muted hover:typo-clr-base'"
          class="px-2.5 py-1 text-xs rounded transition cursor-pointer"
        >
          All Types
        </button>
        <button
          type="button"
          @click="selectedType = 'delivery'"
          :class="selectedType === 'delivery' ? 'surface-2 text-indigo-600 dark:text-violet-400 font-medium shadow-xs' : 'typo-clr-muted hover:typo-clr-base'"
          class="px-2.5 py-1 text-xs rounded transition flex items-center gap-1.5 cursor-pointer"
        >
          <ICart width="12" height="12" />
          <span>Delivery</span>
        </button>
        <button
          type="button"
          @click="selectedType = 'pickup'"
          :class="selectedType === 'pickup' ? 'surface-2 text-indigo-600 dark:text-violet-400 font-medium shadow-xs' : 'typo-clr-muted hover:typo-clr-base'"
          class="px-2.5 py-1 text-xs rounded transition flex items-center gap-1.5 cursor-pointer"
        >
          <IShoppingBag width="12" height="12" />
          <span>Pickup</span>
        </button>
      </div>
    </div>

    <!-- Main Orders Ledger -->
    <div class="surface-1 rounded-lg border border-gray-2 dark:border-dark-3 overflow-hidden shadow-xs flex flex-col min-h-340px">
      <!-- Table Header & Column Sorter -->
      <div class="overflow-x-auto overflow-y-hidden grow">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="surface-2 border-b border-gray-2 dark:border-dark-3 text-11px font-mono uppercase tracking-wider typo-clr-muted select-none">
              <th scope="col" class="py-3 px-4 font-medium">Tracking ID</th>
              <th scope="col" class="py-3 px-4 font-medium">Customer</th>
              <th scope="col" class="py-3 px-4 font-medium">Date & Time</th>
              <th scope="col" class="py-3 px-4 font-medium">Method</th>
              <th scope="col" class="py-3 px-4 font-medium text-right">Settlement</th>
              <th scope="col" class="py-3 px-4 font-medium">Fulfillment Status</th>
              <th scope="col" class="py-3 px-4 font-medium text-right">Actions</th>
            </tr>
          </thead>

          <tbody v-if="store.isLoadingOrders" class="divide-y divide-gray-2 dark:divide-dark-3">
            <tr v-for="n in 8" :key="n" class="animate-pulse">
              <td class="py-3 px-4"><div class="h-4 w-14 max-w-full bg-gray-2 dark:bg-dark-3 rounded" /></td>
              <td class="py-3 px-4"><div class="h-4 w-32 max-w-full bg-gray-2 dark:bg-dark-3 rounded" /></td>
              <td class="py-3 px-4"><div class="h-4 w-24 max-w-full bg-gray-2 dark:bg-dark-3 rounded" /></td>
              <td class="py-3 px-4"><div class="h-4 w-16 max-w-full bg-gray-2 dark:bg-dark-3 rounded-full" /></td>
              <td class="py-3 px-4"><div class="h-4 w-16 max-w-full bg-gray-2 dark:bg-dark-3 rounded ml-auto" /></td>
              <td class="py-3 px-4"><div class="h-4 w-20 max-w-full bg-gray-2 dark:bg-dark-3 rounded-full" /></td>
              <td class="py-3 px-4"><div class="h-4 w-12 max-w-full bg-gray-2 dark:bg-dark-3 rounded ml-auto" /></td>
            </tr>
          </tbody>

          <tbody v-else-if="store.orderList && store.orderList.length > 0" class="divide-y divide-gray-2 dark:divide-dark-3 text-xs sm:text-sm">
            <tr
              v-for="(order, idx) in store.orderList"
              :key="order.id"
              class="hover:surface-2 transition-colors duration-150 group animate-row-in"
              :style="{ animationDelay: `${Math.min(idx * 25, 200)}ms` }"
            >
              <!-- Tracking ID -->
              <td class="py-3 px-4 font-mono font-bold">
                <RouterLink
                  :to="`/orders/${order.id}`"
                  class="text-indigo-600 dark:text-violet-400 hover:underline inline-flex items-center gap-1 focus:outline-none"
                >
                  <span>#{{ order.id }}</span>
                </RouterLink>
              </td>

              <!-- Customer -->
              <td class="py-3 px-4">
                <div class="flex items-center gap-2.5">
                  <div
                    class="w-7 h-7 rounded-full flex items-center justify-center font-bold text-11px shrink-0 select-none text-white"
                    :style="{ backgroundColor: getCustomerColor(order.customers?.name || String(order.owner)) }"
                  >
                    {{ getInitials(order.customers?.name || 'Customer') }}
                  </div>
                  <div class="min-w-0">
                    <RouterLink
                      :to="`/customers/${order.owner}`"
                      class="font-medium typo-clr-base hover:text-indigo-600 dark:hover:text-violet-400 truncate block transition"
                    >
                      {{ order.customers?.name ?? 'Customer #' + order.owner }}
                    </RouterLink>
                    <span v-if="order.note" class="text-11px typo-clr-muted truncate block max-w-180px sm:max-w-xs">
                      {{ order.note }}
                    </span>
                  </div>
                </div>
              </td>

              <!-- Date & Time -->
              <td class="py-3 px-4 font-mono text-xs typo-clr-muted tabular-nums whitespace-nowrap">
                <div>{{ formatDate(order.created_at) }}</div>
                <div class="text-10px opacity-70">{{ formatTime(order.created_at) }}</div>
              </td>

              <!-- Method -->
              <td class="py-3 px-4 whitespace-nowrap">
                <span
                  class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-11px font-mono uppercase tracking-wider border"
                  :class="order.type === 'pickup'
                    ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                    : 'bg-indigo-500/10 text-indigo-600 dark:text-violet-400 border-indigo-500/20'"
                >
                  <component :is="order.type === 'pickup' ? IShoppingBag : ICart" width="11" height="11" />
                  <span>{{ order.type || 'delivery' }}</span>
                </span>
              </td>

              <!-- Total Settlement -->
              <td class="py-3 px-4 text-right font-mono font-bold typo-clr-base tabular-nums whitespace-nowrap">
                ${{ Number(order.total_purchases ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}
              </td>

              <!-- Status with Inline Workflow Action -->
              <td class="py-3 px-4 whitespace-nowrap">
                <div class="relative inline-block text-left">
                  <button
                    type="button"
                    @click="toggleStatusMenu(order.id)"
                    class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-11px font-medium capitalize transition-all duration-150 active:scale-95 cursor-pointer border focus:outline-none"
                    :class="getStatusBadgeClass(order.status)"
                  >
                    <span class="w-1.5 h-1.5 rounded-full" :class="getStatusDotClass(order.status)" />
                    <span>{{ order.status ?? 'pending' }}</span>
                    <ICaretDown width="10" height="10" class="opacity-60 group-hover:opacity-100 transition-transform duration-150" :class="{ 'rotate-180': openStatusMenuId === order.id }" />
                  </button>

                  <!-- Backdrop for click outside -->
                  <div
                    v-if="openStatusMenuId === order.id"
                    class="fixed inset-0 z-20"
                    @click="openStatusMenuId = null"
                  />

                  <!-- Inline Quick Status Menu -->
                  <transition name="popover-scale">
                    <div
                      v-if="openStatusMenuId === order.id"
                      class="absolute left-0 mt-1 w-36 surface-1 rounded-md shadow-lg border border-gray-2 dark:border-dark-3 py-1 z-30 text-xs origin-top-left"
                    >
                      <div class="px-2.5 py-1 text-10px font-mono uppercase tracking-wider typo-clr-muted border-b border-gray-2 dark:border-dark-3">
                        Advance Status
                      </div>
                      <button
                        type="button"
                        @click="updateStatus(order.id, 'pending')"
                        class="w-full text-left px-3 py-1.5 hover:surface-2 transition-colors duration-100 flex items-center gap-2 typo-clr-base cursor-pointer"
                      >
                        <span class="w-1.5 h-1.5 rounded-full bg-amber-500" />
                        <span>Pending</span>
                      </button>
                      <button
                        type="button"
                        @click="updateStatus(order.id, 'completed')"
                        class="w-full text-left px-3 py-1.5 hover:surface-2 transition-colors duration-100 flex items-center gap-2 typo-clr-base cursor-pointer"
                      >
                        <span class="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span>Completed</span>
                      </button>
                      <button
                        type="button"
                        @click="updateStatus(order.id, 'canceled')"
                        class="w-full text-left px-3 py-1.5 hover:surface-2 transition-colors duration-100 flex items-center gap-2 text-rose-500 cursor-pointer"
                      >
                        <span class="w-1.5 h-1.5 rounded-full bg-rose-500" />
                        <span>Canceled</span>
                      </button>
                    </div>
                  </transition>
                </div>
              </td>

              <!-- Actions -->
              <td class="py-3 px-4 text-right whitespace-nowrap">
                <RouterLink
                  :to="`/orders/${order.id}`"
                  class="inline-flex items-center gap-1 px-2.5 py-1 rounded surface-2 hover:bg-indigo-50 dark:hover:bg-violet-950/30 text-indigo-600 dark:text-violet-400 text-xs font-medium transition"
                  title="View order details"
                >
                  <IEye width="13" height="13" />
                  <span>Inspect</span>
                </RouterLink>
              </td>
            </tr>
          </tbody>

          <!-- Empty State -->
          <tbody v-else>
            <tr>
              <td colspan="7" class="py-14 text-center">
                <div class="flex flex-col items-center justify-center max-w-sm mx-auto">
                  <div class="w-12 h-12 rounded-full surface-2 flex items-center justify-center typo-clr-muted mb-3">
                    <IShoppingBag width="22" height="22" />
                  </div>
                  <h3 class="text-base font-bold typo-clr-base">No orders found</h3>
                  <p class="typo-sm typo-clr-muted mt-1 mb-4">
                    {{ searchQuery || selectedStatus !== 'all' || selectedType !== 'all'
                      ? 'No orders match your current filter parameters.'
                      : 'No orders have been recorded in the dispatch log yet.' }}
                  </p>
                  <button
                    v-if="searchQuery || selectedStatus !== 'all' || selectedType !== 'all'"
                    type="button"
                    @click="resetFilters"
                    class="px-3 py-1.5 rounded-md surface-2 typo-clr-base text-xs font-medium hover:surface-3 transition border border-gray-2 dark:border-dark-3 cursor-pointer"
                  >
                    Clear All Filters
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
            {{ store.orderList?.length ?? 0 }}
          </span>
          <span>of</span>
          <span class="font-mono font-bold typo-clr-base tabular-nums">
            {{ store.countAll ?? 0 }}
          </span>
          <span>orders</span>
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

    <!-- Create Order Dialog -->
    <OrderDialog @success="handleOrderCreated" ref="orderDialogRef" />
  </main>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useOrderStore } from '~/store/orders'
import OrderDialog from '~/components/OrderDialog.vue'
import { IAdd, ISearch, ICart, IShoppingBag, ICheckCircle, ICaretDown, IEye } from '~/components/icons'

const orderDialogRef = ref<InstanceType<typeof OrderDialog> | null>(null)
const store = useOrderStore()

const selectedStatus = ref<'all' | 'pending' | 'completed' | 'canceled'>('all')
const selectedType = ref<'all' | 'delivery' | 'pickup'>('all')
const searchQuery = ref('')
const currentPage = ref(1)
const itemsPerPage = 10
const openStatusMenuId = ref<number | null>(null)

const maxPages = computed(() => Math.max(1, Math.ceil((store.countAll ?? 0) / itemsPerPage)))

const fulfillmentRatePct = computed(() => {
  const total = store.metrics?.allOrdersCount || store.countAll || 1
  const completed = store.metrics?.completedCount || 0
  return Math.round((completed / total) * 100)
})

const formattedTotalRevenue = computed(() => {
  const rev = store.metrics?.totalRevenue ?? 0
  return `$${rev.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
})

const formattedAOV = computed(() => {
  const count = store.metrics?.allOrdersCount || store.countAll || 0
  const rev = store.metrics?.totalRevenue ?? 0
  if (!count) return '$0.00'
  return `$${(rev / count).toFixed(2)}`
})

async function fetchOrders() {
  await store.getOrders({
    page: currentPage.value,
    itemsPerPage,
    orderOptions: { column: 'id', foreignTable: '', ascending: false },
    filter: {
      status: selectedStatus.value,
      type: selectedType.value,
      query: searchQuery.value,
    },
  })
}

function selectStatusFilter(status: 'all' | 'pending' | 'completed' | 'canceled') {
  selectedStatus.value = status
  currentPage.value = 1
  fetchOrders()
}

watch([selectedType, searchQuery], () => {
  currentPage.value = 1
  fetchOrders()
})

function changePage(page: number) {
  if (page < 1 || page > maxPages.value) return
  currentPage.value = page
  fetchOrders()
}

function resetFilters() {
  selectedStatus.value = 'all'
  selectedType.value = 'all'
  searchQuery.value = ''
  currentPage.value = 1
  fetchOrders()
}

function toggleStatusMenu(orderId: number) {
  openStatusMenuId.value = openStatusMenuId.value === orderId ? null : orderId
}

async function updateStatus(orderId: number, status: string) {
  openStatusMenuId.value = null
  await store.updateOrderStatus(orderId, status)
  await Promise.all([fetchOrders(), store.loadMetrics('all')])
}

function handleOrderCreated() {
  fetchOrders()
  store.loadMetrics('all')
}

function formatDate(dateStr?: string | null) {
  if (!dateStr) return '-'
  const d = new Date(dateStr)
  return isNaN(d.getTime()) ? dateStr : d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function formatTime(dateStr?: string | null) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return isNaN(d.getTime()) ? '' : d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
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

function getStatusBadgeClass(status?: string | null) {
  switch (status) {
    case 'completed':
      return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20'
    case 'canceled':
      return 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20 hover:bg-rose-500/20'
    default:
      return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 hover:bg-amber-500/20'
  }
}

function getStatusDotClass(status?: string | null) {
  switch (status) {
    case 'completed':
      return 'bg-emerald-500'
    case 'canceled':
      return 'bg-rose-500'
    default:
      return 'bg-amber-500 animate-pulse'
  }
}

onMounted(async () => {
  await Promise.all([fetchOrders(), store.loadMetrics('all')])
})
</script>
