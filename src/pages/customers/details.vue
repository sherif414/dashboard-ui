<template>
  <!-- 404 / Customer Not Found State -->
  <main class="grid place-items-center w-full min-h-[60vh] p8" v-if="hasError">
    <div class="flex flex-col items-center gap-3 text-center max-w-md">
      <ICustomers width="48" height="48" class="typo-clr-muted opacity-40" />
      <h1 class="typo-head text-xl font-bold">Customer was not found</h1>
      <p class="typo-sm typo-clr-muted">
        The requested customer account does not exist or has been removed from the database.
      </p>
      <RouterLink
        to="/customers"
        class="typo-clr-primary mt-2 font-medium hover:underline flex items-center gap-1.5 text-sm"
      >
        ← Back to customers list
      </RouterLink>
    </div>
  </main>

  <main v-else class="flex flex-col gap-6 overflow-auto p4 lg:p6 w-full">
    <!-- Suspend confirmation dialog -->
    <dialog
      ref="dialogSuspend"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="suspend-dialog-title"
      class="open:backdrop:backdrop-blur-4 rounded-lg p-6 surface-1 typo-clr-base shadow-2xl border border-gray-2 dark:border-dark-3 w-full max-w-md mx-auto"
    >
      <div class="flex flex-col gap-4">
        <div class="flex items-start gap-3.5">
          <div class="w-10 h-10 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400 flex items-center justify-center shrink-0 font-bold text-lg">
            !
          </div>
          <div class="flex flex-col gap-1">
            <h2 id="suspend-dialog-title" class="typo-head font-bold">Suspend Customer Account?</h2>
            <p class="typo-sm typo-clr-muted">
              Suspending <strong class="typo-clr-base">{{ customer?.name }}</strong> will mark their account as suspended and prevent them from placing new orders. You can unsuspend at any time.
            </p>
          </div>
        </div>
        <div class="flex items-center justify-end gap-3 pt-3 border-t border-gray-2 dark:border-dark-3">
          <Btn variant="text" type="button" @click="dialogSuspend?.close()">Cancel</Btn>
          <Btn
            class="bg-amber-600! text-white! hover:bg-amber-700! focus-visible:ring-amber-500 cursor-pointer"
            :loading="isSuspending"
            @click="confirmSuspend"
          >
            Suspend Account
          </Btn>
        </div>
      </div>
    </dialog>

    <!-- Header navigation & status -->
    <header class="flex flex-wrap gap-4 items-center justify-between surface-1 p4 sm:p-5 rounded-md border border-gray-2 dark:border-dark-3">
      <div class="flex flex-wrap gap-4 sm:gap-6 items-center">
        <RouterLink
          to="/customers"
          class="typo-sm typo-clr-muted hover:typo-clr-base flex items-center gap-1.5 transition"
        >
          ← Customers
        </RouterLink>
        <h1 class="typo-head flex items-center gap-2">
          <span>Customer:</span>
          <span class="font-bold typo-clr-base">{{ customer?.name || 'Loading...' }}</span>
          <span class="font-mono text-xs typo-clr-muted tabular-nums">#{{ customer?.id }}</span>
        </h1>
        <Chip v-if="customer" :status="customer.status ? 'active' : 'suspended'">
          {{ customer.status ? 'Active' : 'Suspended' }}
        </Chip>
        <span class="typo-sm typo-clr-muted">
          Customer Since:
          <span class="font-mono font-medium typo-clr-base ml-1">{{
            customer?.created_at ? useDateFormat(customer.created_at, 'DD MMM YYYY').value : '-'
          }}</span>
        </span>
      </div>

      <Btn
        v-if="customer"
        :loading="isSuspending"
        class="ml-auto cursor-pointer"
        :class="
          !customer.status
            ? 'bg-emerald-600! text-white! hover:bg-emerald-700!'
            : 'bg-rose-50! text-rose-700 hover:bg-rose-100! dark:bg-rose-950/40! dark:text-rose-300! dark:hover:bg-rose-900/50! border border-rose-200 dark:border-rose-900/50'
        "
        @click="customer.status ? dialogSuspend?.showModal() : handleDirectUnsuspend()"
      >
        {{ customer.status ? 'Suspend Customer' : 'Unsuspend Customer' }}
      </Btn>
    </header>

    <!-- Details 3-card grid -->
    <section class="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
      <!-- Card 1: Contact Information (proper CRM card) -->
      <div class="surface-1 p-5 rounded-md border border-gray-2 dark:border-dark-3 flex flex-col justify-between gap-4">
        <div class="flex items-center gap-3">
          <div class="p-2.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400">
            <ICustomers width="20" height="20" />
          </div>
          <div>
            <h2 class="typo-base font-semibold typo-clr-base leading-tight">{{ customer?.name }}</h2>
            <p class="typo-sm typo-clr-muted">Customer ID #{{ customer?.id }}</p>
          </div>
        </div>
        <div class="space-y-2.5 pt-2 border-t border-gray-1 dark:border-dark-3">
          <div class="flex items-center justify-between text-xs">
            <span class="typo-clr-muted">Email</span>
            <a
              v-if="customer?.email"
              :href="'mailto:' + customer.email"
              class="typo-clr-primary hover:underline font-medium truncate max-w-[220px]"
              :title="customer.email"
            >
              {{ customer.email }}
            </a>
            <span v-else class="typo-clr-muted">-</span>
          </div>
          <div class="flex items-center justify-between text-xs">
            <span class="typo-clr-muted">Phone</span>
            <a
              v-if="customer?.phone"
              :href="'tel:' + customer.phone"
              class="typo-clr-base font-mono tabular-nums hover:typo-clr-primary"
            >
              {{ customer.phone }}
            </a>
            <span v-else class="typo-clr-muted">-</span>
          </div>
        </div>
      </div>

      <!-- Card 2: Address Information -->
      <div class="surface-1 p-5 rounded-md border border-gray-2 dark:border-dark-3 flex flex-col justify-between gap-4">
        <div class="flex items-center gap-3">
          <div class="p-2.5 rounded-lg bg-violet-50 dark:bg-violet-950/30 text-violet-600 dark:text-violet-400">
            <ILocation width="20" height="20" />
          </div>
          <div>
            <h2 class="typo-base font-semibold typo-clr-base leading-tight">Addresses</h2>
            <p class="typo-sm typo-clr-muted">Delivery & Billing</p>
          </div>
        </div>
        <div class="space-y-2.5 pt-2 border-t border-gray-1 dark:border-dark-3">
          <div class="flex items-start justify-between text-xs gap-2">
            <span class="typo-clr-muted shrink-0">Home</span>
            <span class="typo-clr-base font-medium text-right line-clamp-2">
              {{ customer?.address || 'No registered delivery address' }}
            </span>
          </div>
          <div class="flex items-start justify-between text-xs gap-2">
            <span class="typo-clr-muted shrink-0">Billing</span>
            <span class="typo-clr-base font-medium text-right line-clamp-2">
              {{ customer?.address ? customer.address + ' (Primary)' : 'No registered billing address' }}
            </span>
          </div>
        </div>
      </div>

      <!-- Card 3: Commercial KPIs -->
      <div class="surface-1 p-5 rounded-md border border-gray-2 dark:border-dark-3 flex flex-col justify-between gap-4">
        <div class="flex items-center gap-3">
          <div class="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400">
            <IShoppingBag width="20" height="20" />
          </div>
          <div>
            <h2 class="typo-base font-semibold typo-clr-base leading-tight">Orders Summary</h2>
            <p class="typo-sm typo-clr-muted">Lifetime Commercial Value</p>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-3 pt-2 border-t border-gray-1 dark:border-dark-3">
          <div>
            <p class="text-xs typo-clr-muted">Total Spent</p>
            <p class="text-base font-bold font-mono tabular-nums text-emerald-700 dark:text-emerald-400">
              ${{ totalPurchasesFormatted }}
            </p>
          </div>
          <div>
            <p class="text-xs typo-clr-muted">Total Orders</p>
            <p class="text-base font-bold font-mono tabular-nums typo-clr-base">
              {{ orders?.length ?? 0 }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Orders BaseTable with client sorting & empty state -->
    <BaseTable
      :show-search="false"
      table-name="customer-orders"
      table-title="Order History"
      :items-count="orders?.length ?? 0"
      :data="sortedOrders"
    >
      <template #header="{ orderBy }">
        <TableHeaderCell
          v-for="head in headers"
          :key="head.key"
          :sort-ascending="orderBy.ascending"
          :order-by="orderBy.column"
          :column="head.key"
          @click="toggleSort(head.key)"
        >
          {{ head.label }}
        </TableHeaderCell>
      </template>

      <template #body>
        <tbody v-if="sortedOrders && sortedOrders.length > 0">
          <tr v-for="item in sortedOrders" :key="item.id" class="hover:surface-2 transition-colors">
            <TableBodyCell :value="item.created_at" variant="date" />
            <TableBodyCell :value="`#${item.id}`" variant="link" :to="`/orders/${item.id}`" class="font-mono tabular-nums text-xs" />
            <TableBodyCell :value="'$' + Number(item.total_purchases || 0).toFixed(2)" class="font-mono tabular-nums font-semibold" />
            <TableBodyCell :value="item.type || 'Standard'" />
            <TableBodyCell :value="item.status" variant="chip" :chip-status="item.status" />
          </tr>
        </tbody>
        <tbody v-else>
          <tr>
            <td colspan="5" class="py-12 text-center">
              <div class="flex flex-col items-center justify-center gap-2">
                <IShoppingBag width="36" height="36" class="typo-clr-muted opacity-40 mb-1" />
                <p class="typo-base font-medium typo-clr-base">No orders yet</p>
                <p class="typo-sm typo-clr-muted">This customer hasn't placed any orders yet.</p>
              </div>
            </td>
          </tr>
        </tbody>
      </template>
    </BaseTable>
  </main>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { useDateFormat } from '@vueuse/core'
import type { Customer, Order } from 'types'
import { customerService } from '~/services/customerService'
import { useMessage } from '~/composables/message'
import Btn from '~/components/Btn.vue'
import Chip from '~/components/Chip.vue'
import BaseTable from '~/components/BaseTable.vue'
import TableHeaderCell from '~/components/TableHeaderCell.vue'
import TableBodyCell from '~/components/TableBodyCell.vue'
import { ICustomers, ILocation, IShoppingBag } from '~/components/icons'

const route = useRoute()
const hasError = ref(false)
const customer = ref<Customer | null>(null)
const orders = ref<Order[] | null>(null)
const isSuspending = ref(false)
const dialogSuspend = ref<HTMLDialogElement | null>(null)

const sortColumn = ref('created_at')
const sortAscending = ref(false)

const headers = [
  { key: 'created_at', label: 'Order Date' },
  { key: 'id', label: 'Tracking ID' },
  { key: 'total_purchases', label: 'Total Purchases' },
  { key: 'type', label: 'Type' },
  { key: 'status', label: 'Status' },
]

function toggleSort(key: string) {
  if (sortColumn.value === key) {
    sortAscending.value = !sortAscending.value
  } else {
    sortColumn.value = key
    sortAscending.value = true
  }
}

const sortedOrders = computed(() => {
  if (!orders.value) return []
  const list = [...orders.value]
  const col = sortColumn.value
  const asc = sortAscending.value
  return list.sort((a: any, b: any) => {
    const valA = a[col]
    const valB = b[col]
    if (valA === valB) return 0
    if (valA === null || valA === undefined) return 1
    if (valB === null || valB === undefined) return -1
    if (typeof valA === 'string' && typeof valB === 'string') {
      return asc ? valA.localeCompare(valB) : valB.localeCompare(valA)
    }
    return asc ? (valA > valB ? 1 : -1) : (valA < valB ? 1 : -1)
  })
})

const totalPurchases = computed(() => {
  if (!orders.value) return 0
  return orders.value.reduce((sum, o) => sum + (o.total_purchases ?? 0), 0)
})

const totalPurchasesFormatted = computed(() => {
  return Number(totalPurchases.value).toFixed(2)
})

async function getCustomer(id: string): Promise<Customer | null> {
  const data = await customerService.getCustomerById(+id)
  if (!data) {
    hasError.value = true
    useMessage('error', 'Customer not found')
    return null
  }
  return data
}

async function getOrders(): Promise<Order[] | null> {
  if (!customer.value) return null
  return await customerService.getCustomerOrders(customer.value.id)
}

async function confirmSuspend() {
  if (!customer.value) return
  isSuspending.value = true
  const res = await customerService.toggleCustomerStatus(customer.value.id)
  isSuspending.value = false
  dialogSuspend.value?.close()
  if (res.error) {
    useMessage('error', res.error.message)
    return
  }
  if (res.data) customer.value = res.data
  useMessage('success', `Customer account has been suspended`)
}

async function handleDirectUnsuspend() {
  if (!customer.value) return
  isSuspending.value = true
  const res = await customerService.toggleCustomerStatus(customer.value.id)
  isSuspending.value = false
  if (res.error) {
    useMessage('error', res.error.message)
    return
  }
  if (res.data) customer.value = res.data
  useMessage('success', `Customer account has been activated`)
}

onMounted(async () => {
  if (Array.isArray(route.params.id) || !route.params.id) {
    hasError.value = true
    return
  }
  customer.value = await getCustomer(route.params.id as string)
  if (!customer.value) {
    hasError.value = true
    return
  }
  orders.value = await getOrders()
})
</script>
