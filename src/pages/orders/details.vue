<template>
  <!-- 404 / Missing Order State -->
  <main class="grid place-items-center w-full min-h-[60vh] p8" v-if="hasError">
    <div class="flex flex-col items-center gap-3 text-center max-w-md">
      <IShoppingBag width="48" height="48" class="typo-clr-muted opacity-40" />
      <h1 class="typo-head text-xl font-bold">Order was not found</h1>
      <p class="typo-sm typo-clr-muted">
        The requested order does not exist or has been removed from the database.
      </p>
      <RouterLink
        to="/orders"
        class="typo-clr-primary mt-2 font-medium hover:underline flex items-center gap-1.5 text-sm"
      >
        ← Back to orders list
      </RouterLink>
    </div>
  </main>

  <!-- Loaded Order Details Surface -->
  <main v-else class="p4 lg:p6 flex flex-col gap-6 overflow-y-auto w-full">
    <!-- delete order dialog -->
    <dialog
      ref="dialogDelete"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="delete-dialog-title"
      class="open:backdrop:backdrop-blur-4 rounded-lg p-6 surface-1 typo-clr-base shadow-2xl border border-gray-2 dark:border-dark-3 w-full max-w-md mx-auto no-print"
    >
      <div class="flex flex-col gap-4">
        <div class="flex items-start gap-3.5">
          <div class="w-10 h-10 rounded-full bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400 flex items-center justify-center shrink-0 font-bold text-lg">
            !
          </div>
          <div class="flex flex-col gap-1">
            <h2 id="delete-dialog-title" class="typo-head font-bold">Delete Order #{{ order?.id }}?</h2>
            <p class="typo-sm typo-clr-muted">
              This will permanently delete order #{{ order?.id }} and its line items from the local database. This action cannot be undone.
            </p>
          </div>
        </div>
        <div class="flex items-center justify-end gap-3 pt-3 border-t border-gray-2 dark:border-dark-3">
          <Btn variant="text" type="button" @click="dialogDelete?.close()">Cancel</Btn>
          <Btn
            class="bg-rose-600! text-white! hover:bg-rose-700! focus-visible:ring-rose-500 cursor-pointer"
            :loading="isDeleting"
            @click="deleteOrder"
          >
            Delete Permanently
          </Btn>
        </div>
      </div>
    </dialog>

    <header class="flex flex-wrap gap-4 items-center justify-between surface-1 p4 sm:p-5 rounded-md border border-gray-2 dark:border-dark-3">
      <div class="flex flex-wrap gap-4 sm:gap-6 items-center">
        <RouterLink
          to="/orders"
          class="typo-sm typo-clr-muted hover:typo-clr-base flex items-center gap-1.5 transition no-print"
        >
          ← Orders
        </RouterLink>
        <h1 class="typo-head flex items-center gap-2">
          <span>Order:</span>
          <span class="font-mono font-bold typo-clr-base">#{{ order?.id }}</span>
        </h1>
        <Chip v-if="order" :status="order.status">
          {{ order.status ? order.status.toUpperCase() : 'PENDING' }}
        </Chip>
        <span class="typo-sm typo-clr-muted">
          Date:
          <span class="typo-clr-base font-mono tabular-nums ml-1">{{ formattedDate }}</span>
        </span>
        <span class="typo-sm typo-clr-muted">
          Total:
          <span class="typo-clr-primary font-bold font-mono tabular-nums ml-1">${{ Number(order?.total_purchases ?? 0).toFixed(2) }}</span>
        </span>
      </div>
      <div class="flex items-center gap-2 ml-auto no-print">
        <button
          type="button"
          @click="printPackingSlip"
          class="px-3 py-1.5 rounded surface-2 hover:surface-3 text-xs font-medium typo-clr-base transition cursor-pointer border border-gray-2 dark:border-dark-3 flex items-center gap-1.5"
          title="Print Packing Slip & Invoice"
        >
          <span>🖨️ Print Slip</span>
        </button>
        <Btn
          @click="dialogDelete?.showModal()"
          variant="text"
          class="text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 px-3 cursor-pointer text-xs"
        >
          Delete Order
        </Btn>
      </div>
    </header>

    <!-- Fulfillment Lifecycle Stepper -->
    <section class="surface-1 p-4 sm:p-5 rounded-md border border-gray-2 dark:border-dark-3 flex flex-col gap-4 w-full">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 class="typo-base font-semibold typo-clr-base leading-tight flex items-center gap-2">
            <span>Fulfillment Lifecycle</span>
            <span class="text-xs px-2 py-0.5 rounded-full uppercase tracking-wider font-mono font-medium surface-2 border border-gray-2 dark:border-dark-3 typo-clr-muted">
              {{ order?.status || 'pending' }}
            </span>
          </h2>
          <p class="typo-sm typo-clr-muted">Track and advance the physical order fulfillment workflow.</p>
        </div>
        <div class="flex items-center gap-2 no-print">
          <Btn
            v-if="nextLifecycleStage"
            :loading="isUpdatingLifecycle"
            class="bg-indigo-600! text-white! hover:bg-indigo-700! focus-visible:ring-indigo-500 cursor-pointer text-xs font-medium px-3.5 py-1.5"
            @click="advanceToNextStage"
          >
            Advance to {{ nextLifecycleStage.label }} →
          </Btn>
          <Btn
            v-else-if="order?.status === 'completed'"
            :loading="isUpdatingLifecycle"
            variant="text"
            class="typo-sm typo-clr-muted hover:typo-clr-base cursor-pointer px-3 py-1 text-xs"
            @click="setStage('pending')"
          >
            ↺ Reopen as Pending
          </Btn>
        </div>
      </div>

      <!-- Horizontal Stage Steps -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2 border-t border-gray-1 dark:border-dark-3">
        <button
          v-for="(stage, idx) in fulfillmentStages"
          :key="stage.key"
          type="button"
          @click="setStage(stage.key)"
          class="flex items-center gap-3 p-2.5 rounded-md transition text-left cursor-pointer group"
          :class="[
            currentStageIndex === idx
              ? 'surface-2 border border-indigo-500/40 dark:border-violet-500/40 shadow-xs'
              : currentStageIndex > idx
              ? 'hover:surface-2 opacity-95'
              : 'hover:surface-2 opacity-60'
          ]"
        >
          <div
            class="w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold transition"
            :class="[
              currentStageIndex > idx
                ? 'bg-emerald-600 text-white'
                : currentStageIndex === idx
                ? 'bg-indigo-600 dark:bg-violet-600 text-white shadow-sm'
                : 'surface-2 text-gray-4 border border-gray-2 dark:border-dark-3'
            ]"
          >
            <ICheck v-if="currentStageIndex > idx" width="14" height="14" />
            <span v-else>{{ idx + 1 }}</span>
          </div>
          <div class="flex flex-col min-w-0">
            <span
              class="typo-sm font-semibold truncate transition"
              :class="currentStageIndex === idx ? 'typo-clr-primary font-bold' : 'typo-clr-base'"
            >
              {{ stage.label }}
            </span>
            <span class="text-11px typo-clr-muted truncate">
              {{ stage.desc }}
            </span>
          </div>
        </button>
      </div>
    </section>

    <!-- Details 3-card grid (CRM Contact, Fulfillment & Delivery, and Payment Summary) -->
    <section class="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
      <!-- Card 1: Customer Profile (proper CRM card) -->
      <div class="surface-1 p-5 rounded-md border border-gray-2 dark:border-dark-3 flex flex-col justify-between gap-4">
        <div class="flex items-center gap-3">
          <div class="p-2.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400">
            <ICustomers width="20" height="20" />
          </div>
          <div class="min-w-0">
            <RouterLink
              v-if="customer?.id"
              :to="`/customers/${customer.id}`"
              class="typo-base font-semibold typo-clr-base hover:typo-clr-primary transition leading-tight flex items-center gap-1.5 truncate"
              :title="customer.name || 'Customer'"
            >
              {{ customer?.name || 'Customer' }}
            </RouterLink>
            <h2 v-else class="typo-base font-semibold typo-clr-base leading-tight">Customer</h2>
            <p class="typo-sm typo-clr-muted">Customer ID #{{ customer?.id ?? 'N/A' }}</p>
          </div>
        </div>
        <div class="space-y-2.5 pt-2 border-t border-gray-1 dark:border-dark-3">
          <div class="flex items-center justify-between text-xs">
            <span class="typo-clr-muted">Email</span>
            <a
              v-if="customer?.email"
              :href="'mailto:' + customer.email"
              class="typo-clr-primary hover:underline font-medium truncate max-w-[190px]"
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
          <div class="flex items-center justify-between text-xs">
            <span class="typo-clr-muted">Customer Since</span>
            <span class="font-mono text-xs typo-clr-base">
              {{ customer?.created_at ? useDateFormat(customer.created_at, 'DD MMM YYYY').value : '-' }}
            </span>
          </div>
        </div>
      </div>

      <!-- Card 2: Fulfillment & Delivery -->
      <div class="surface-1 p-5 rounded-md border border-gray-2 dark:border-dark-3 flex flex-col justify-between gap-4">
        <div class="flex items-center gap-3">
          <div class="p-2.5 rounded-lg bg-violet-50 dark:bg-violet-950/30 text-violet-600 dark:text-violet-400">
            <ILocation width="20" height="20" />
          </div>
          <div>
            <h2 class="typo-base font-semibold typo-clr-base leading-tight">Fulfillment & Delivery</h2>
            <p class="typo-sm typo-clr-muted capitalize">{{ order?.type || 'Standard Delivery' }}</p>
          </div>
        </div>
        <div class="space-y-2.5 pt-2 border-t border-gray-1 dark:border-dark-3">
          <div class="flex items-start justify-between text-xs gap-2">
            <span class="typo-clr-muted shrink-0">Address</span>
            <span class="typo-clr-base font-medium text-right line-clamp-2">
              {{ customer?.address || 'No registered delivery address' }}
            </span>
          </div>
          <div class="flex items-center justify-between text-xs">
            <span class="typo-clr-muted">Method</span>
            <span class="typo-clr-base font-medium capitalize">{{ order?.type || 'Delivery' }}</span>
          </div>
          <div class="flex items-center justify-between text-xs">
            <span class="typo-clr-muted">Fulfillment</span>
            <Chip :status="order?.status">{{ order?.status ? order.status.toUpperCase() : 'PENDING' }}</Chip>
          </div>
        </div>
      </div>

      <!-- Card 3: Payment & Commercial Overview -->
      <div class="surface-1 p-5 rounded-md border border-gray-2 dark:border-dark-3 flex flex-col justify-between gap-4">
        <div class="flex items-center gap-3">
          <div class="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400">
            <ICreditCard width="20" height="20" />
          </div>
          <div>
            <h2 class="typo-base font-semibold typo-clr-base leading-tight">Payment & Total</h2>
            <p class="typo-sm typo-clr-muted">Commercial Summary</p>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-3 pt-2 border-t border-gray-1 dark:border-dark-3">
          <div>
            <p class="text-xs typo-clr-muted">Order Total</p>
            <p class="text-base font-bold font-mono tabular-nums text-emerald-700 dark:text-emerald-400">
              ${{ Number(order?.total_purchases ?? 0).toFixed(2) }}
            </p>
          </div>
          <div>
            <p class="text-xs typo-clr-muted">Line Items</p>
            <p class="text-base font-bold font-mono tabular-nums typo-clr-base">
              {{ orderItems?.length ?? 0 }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Order Notes Callout (when present) -->
    <section
      v-if="order?.note"
      class="surface-1 p-4 rounded-md border border-amber-200 dark:border-amber-900/40 bg-amber-50/40 dark:bg-amber-950/10 flex items-start gap-3 w-full"
      aria-label="Order note"
    >
      <div class="p-2 rounded-md bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400 shrink-0">
        <IMessage width="18" height="18" />
      </div>
      <div class="flex flex-col gap-0.5 min-w-0">
        <h3 class="typo-sm font-semibold typo-clr-base">Customer / Fulfillment Note</h3>
        <p class="typo-sm typo-clr-muted leading-relaxed">{{ order.note }}</p>
      </div>
    </section>

    <!-- Order items table with client sorting and empty state -->
    <BaseTable
      :show-search="false"
      table-name="order_item"
      table-title="Order Items"
      :items-count="orderItems?.length ?? 0"
      :data="sortedOrderItems"
    >
      <template #header="{ orderBy }">
        <TableHeaderCell
          v-for="head in headers"
          :key="head.key"
          :sort-ascending="sortColumn === head.key ? sortAscending : orderBy.ascending"
          :order-by="sortColumn"
          :column="head.key"
          @click="toggleSort(head.key)"
        >
          {{ head.label }}
        </TableHeaderCell>
      </template>

      <template #body>
        <tbody v-if="sortedOrderItems && sortedOrderItems.length > 0">
          <tr v-for="item in sortedOrderItems" :key="item.product_id" class="hover:surface-2 transition-colors">
            <TableBodyCell
              :value="item.products?.name ?? 'Product #' + item.product_id"
              variant="link"
              :to="`/products/${item.product_id}`"
            />
            <TableBodyCell
              :value="'$' + Number(item.products?.sell_price || 0).toFixed(2)"
              class="font-mono tabular-nums"
            />
            <TableBodyCell
              :value="item.quantity"
              class="font-mono tabular-nums"
            />
            <TableBodyCell
              :value="item.discount ? item.discount + '%' : '-'"
              class="font-mono tabular-nums"
            />
            <TableBodyCell
              :value="'$' + calculateItemTotal(item)"
              class="font-mono tabular-nums font-semibold"
            />
            <TableBodyCell
              :value="item.status"
              variant="chip"
              :chip-status="item.status"
            />
          </tr>
        </tbody>
        <tbody v-else>
          <tr>
            <td colspan="6" class="py-12 text-center">
              <div class="flex flex-col items-center justify-center gap-2">
                <IShoppingBag width="36" height="36" class="typo-clr-muted opacity-40 mb-1" />
                <p class="typo-base font-medium typo-clr-base">No order items</p>
                <p class="typo-sm typo-clr-muted">This order does not contain any recorded items.</p>
              </div>
            </td>
          </tr>
        </tbody>
      </template>

      <template #pagination>
        <span class="font-mono tabular-nums font-bold">
          Order Total: ${{ Number(order?.total_purchases ?? 0).toFixed(2) }}
        </span>
      </template>
    </BaseTable>
  </main>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { useDateFormat } from '@vueuse/core'
import type { Customer, Order } from 'types'
import { orderService } from '~/services/orderService'
import { useMessage } from '~/composables/message'
import Btn from '~/components/Btn.vue'
import Chip from '~/components/Chip.vue'
import BaseTable from '~/components/BaseTable.vue'
import TableHeaderCell from '~/components/TableHeaderCell.vue'
import TableBodyCell from '~/components/TableBodyCell.vue'
import { ICustomers, ILocation, ICreditCard, IMessage, IShoppingBag, ICheck } from '~/components/icons'

const route = useRoute()
const router = useRouter()

const hasError = ref(false)
const customer = ref<Customer | null | undefined>(null)
const order = ref<Order | null>(null)
const orderItems = ref<any[] | null>(null)

const isDeleting = ref(false)
const dialogDelete = ref<HTMLDialogElement | null>(null)
const isUpdatingLifecycle = ref(false)

const sortColumn = ref('product_name')
const sortAscending = ref(true)

const headers = [
  { key: 'product_name', label: 'Product Name' },
  { key: 'sell_price', label: 'Unit Price' },
  { key: 'quantity', label: 'Quantity' },
  { key: 'discount', label: 'Discount' },
  { key: 'total_price', label: 'Total Price' },
  { key: 'status', label: 'Status' },
]

const fulfillmentStages = [
  { key: 'pending', label: 'Order Placed', desc: 'Received & Queued' },
  { key: 'processing', label: 'Processing', desc: 'Picking & Packaging' },
  { key: 'shipped', label: 'In Transit', desc: 'Carrier Dispatched' },
  { key: 'completed', label: 'Delivered', desc: 'Fulfilled & Closed' },
]

const currentStageIndex = computed(() => {
  const st = String(order.value?.status || 'pending').toLowerCase()
  return fulfillmentStages.findIndex((s) => s.key === st)
})

const nextLifecycleStage = computed(() => {
  const idx = currentStageIndex.value
  if (idx >= 0 && idx < fulfillmentStages.length - 1) {
    return fulfillmentStages[idx + 1]
  }
  return null
})

const formattedDate = computed(() => {
  return order.value?.created_at
    ? useDateFormat(order.value.created_at, 'DD MMM YYYY · hh:mm aa').value
    : '-'
})

function calculateItemTotal(item: any): string {
  const qty = item.quantity || 1
  const price = item.products?.sell_price || 0
  const discountPct = Number(item.discount || 0)
  const total = qty * price * (1 - discountPct / 100)
  return total.toFixed(2)
}

function toggleSort(key: string) {
  if (sortColumn.value === key) {
    sortAscending.value = !sortAscending.value
  } else {
    sortColumn.value = key
    sortAscending.value = true
  }
}

const sortedOrderItems = computed(() => {
  if (!orderItems.value) return []
  const list = [...orderItems.value]
  const col = sortColumn.value
  const asc = sortAscending.value

  return list.sort((a: any, b: any) => {
    let valA: any
    let valB: any

    if (col === 'product_name') {
      valA = a.products?.name ?? ''
      valB = b.products?.name ?? ''
    } else if (col === 'sell_price') {
      valA = a.products?.sell_price ?? 0
      valB = b.products?.sell_price ?? 0
    } else if (col === 'total_price') {
      valA = Number(calculateItemTotal(a))
      valB = Number(calculateItemTotal(b))
    } else {
      valA = a[col]
      valB = b[col]
    }

    if (valA === valB) return 0
    if (valA === null || valA === undefined) return 1
    if (valB === null || valB === undefined) return -1
    if (typeof valA === 'string' && typeof valB === 'string') {
      return asc ? valA.localeCompare(valB) : valB.localeCompare(valA)
    }
    return asc ? (valA > valB ? 1 : -1) : (valA < valB ? 1 : -1)
  })
})

async function getData(orderId: string) {
  try {
    const data = await orderService.getOrderById(+orderId)
    if (!data) {
      hasError.value = true
      return
    }
    customer.value = data.customers
    orderItems.value = data.order_item
    order.value = {
      id: data.id,
      owner: data.owner,
      type: data.type,
      status: data.status,
      note: data.note,
      total_purchases: data.total_purchases,
      created_at: data.created_at,
    }
  } catch (err: any) {
    hasError.value = true
    useMessage('error', err.message || 'An error has occurred')
  }
}

async function setStage(stageKey: string) {
  if (!order.value) return
  isUpdatingLifecycle.value = true
  const res = await orderService.updateOrderStatus(order.value.id, stageKey)
  isUpdatingLifecycle.value = false

  if (res.error) {
    useMessage('error', res.error.message)
    return
  }

  order.value.status = stageKey
  if (orderItems.value) {
    orderItems.value.forEach((item) => (item.status = stageKey))
  }
  useMessage('success', `Order status updated to ${stageKey}`)
}

async function advanceToNextStage() {
  if (nextLifecycleStage.value) {
    await setStage(nextLifecycleStage.value.key)
  }
}

async function deleteOrder() {
  if (!order.value?.id) return
  isDeleting.value = true
  const res = await orderService.deleteOrder(order.value.id)
  isDeleting.value = false

  if (res.error) {
    useMessage('error', res.error.message)
    dialogDelete.value?.close()
    return
  }

  useMessage('success', 'Order deleted!')
  router.push('/orders')
}

function printPackingSlip() {
  window.print()
}

onMounted(() => {
  if (typeof route.params.id === 'string') getData(route.params.id)
})
</script>

<style scoped>
@media print {
  :deep(.no-print) {
    display: none !important;
  }
}
</style>
