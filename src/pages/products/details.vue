<template>
  <main class="grid place-items-center w-full h-full p8" v-if="hasError">
    <div class="flex flex-col items-center gap-3 text-center">
      <IInventory width="48" height="48" class="typo-clr-muted opacity-40" />
      <h1 class="typo-head text-xl font-bold">Product was not found</h1>
      <p class="typo-sm typo-clr-muted">The requested product does not exist or has been removed.</p>
      <RouterLink to="/products" class="typo-clr-primary mt-2 font-medium hover:underline">← Back to products catalog</RouterLink>
    </div>
  </main>
  <main v-else class="flex flex-col gap-6 p4 lg:p6 overflow-y-auto w-full">
    <!-- Unpublish confirmation dialog -->
    <dialog
      ref="dialogUnpublish"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="unpublish-dialog-title"
      class="open:backdrop:backdrop-blur-4 rounded-lg p-6 surface-1 typo-clr-base shadow-2xl border border-gray-2 dark:border-dark-3 w-full max-w-md mx-auto"
    >
      <div class="flex flex-col gap-4">
        <div class="flex items-start gap-3.5">
          <div class="w-10 h-10 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400 flex items-center justify-center shrink-0 font-bold text-lg">
            !
          </div>
          <div class="flex flex-col gap-1">
            <h2 id="unpublish-dialog-title" class="typo-head font-bold">Unpublish Product?</h2>
            <p class="typo-sm typo-clr-muted">
              Unpublishing <strong class="typo-clr-base">{{ product?.name }}</strong> will hide it from the public storefront. Existing orders containing this product will not be affected.
            </p>
          </div>
        </div>
        <div class="flex items-center justify-end gap-3 pt-3 border-t border-gray-2 dark:border-dark-3">
          <Btn variant="text" type="button" @click="dialogUnpublish?.close()">Cancel</Btn>
          <Btn
            class="bg-amber-600! text-white! hover:bg-amber-700! focus-visible:ring-amber-500 cursor-pointer"
            :loading="isLoading"
            @click="confirmUnpublish"
          >
            Unpublish Product
          </Btn>
        </div>
      </div>
    </dialog>

    <!-- Delete product dialog -->
    <dialog
      ref="dialogDelete"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="delete-product-title"
      class="open:backdrop:backdrop-blur-4 rounded-lg p-6 surface-1 typo-clr-base shadow-2xl border border-gray-2 dark:border-dark-3 w-full max-w-md mx-auto"
    >
      <div class="flex flex-col gap-4">
        <div class="flex items-start gap-3.5">
          <div class="w-10 h-10 rounded-full bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400 flex items-center justify-center shrink-0 font-bold text-lg">
            !
          </div>
          <div class="flex flex-col gap-1">
            <h2 id="delete-product-title" class="typo-head font-bold">Delete Product?</h2>
            <p class="typo-sm typo-clr-muted">
              Are you sure you want to permanently delete <strong class="typo-clr-base">{{ product?.name }}</strong>? This action cannot be undone.
            </p>
          </div>
        </div>
        <div class="flex items-center justify-end gap-3 pt-3 border-t border-gray-2 dark:border-dark-3">
          <Btn variant="text" type="button" @click="dialogDelete?.close()">Cancel</Btn>
          <Btn
            class="bg-rose-600! text-white! hover:bg-rose-700! focus-visible:ring-rose-500 cursor-pointer"
            :loading="isDeleting"
            @click="confirmDelete"
          >
            Delete Permanently
          </Btn>
        </div>
      </div>
    </dialog>

    <!-- Header navigation & status -->
    <header class="flex flex-wrap gap-4 items-center justify-between surface-1 p4 sm:p-5 rounded-md border border-gray-2 dark:border-dark-3">
      <div class="flex flex-wrap gap-4 sm:gap-6 items-center">
        <RouterLink
          to="/products"
          class="typo-sm typo-clr-muted hover:typo-clr-base flex items-center gap-1.5 transition"
        >
          ← Products
        </RouterLink>
        <h1 class="typo-head flex items-center gap-2">
          <span>Product:</span>
          <span class="font-bold typo-clr-base">{{ product?.name || 'Loading...' }}</span>
          <span class="font-mono text-xs typo-clr-muted tabular-nums">#{{ route.params.id }}</span>
        </h1>
        <Chip v-if="product" :status="product.published ? 'published' : 'unpublished'">
          {{ product.published ? 'Published' : 'Unpublished' }}
        </Chip>
        <span class="typo-sm typo-clr-muted">
          Date Added:
          <span class="font-mono font-medium typo-clr-base ml-1">{{
            product?.created_at ? useDateFormat(product.created_at, 'DD MMM YYYY').value : '-'
          }}</span>
        </span>
      </div>

      <div class="flex items-center gap-3 ml-auto">
        <Btn
          v-if="product"
          variant="text"
          class="text-rose-600 hover:text-rose-700 dark:text-rose-400 cursor-pointer"
          @click="dialogDelete?.showModal()"
        >
          <ITrash width="15" height="15" class="mr-1 inline" />
          Delete
        </Btn>
        <Btn
          v-if="product"
          :loading="isLoading"
          class="cursor-pointer"
          :class="
            !product.published
              ? 'bg-emerald-600! text-white! hover:bg-emerald-700!'
              : 'bg-rose-50! text-rose-700 hover:bg-rose-100! dark:bg-rose-950/40! dark:text-rose-300! dark:hover:bg-rose-900/50! border border-rose-200 dark:border-rose-900/50'
          "
          @click="product.published ? dialogUnpublish?.showModal() : handleDirectPublish()"
        >
          {{ product.published ? 'Unpublish Product' : 'Publish Product' }}
        </Btn>
      </div>
    </header>

    <section class="flex flex-col gap-6 w-full">
      <!-- Top product metric cards (4 cols) -->
      <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 w-full">
        <!-- Card 1: Product Image Thumbnail -->
        <div class="rounded-md surface-1 p-4 sm:p-5 flex items-center justify-center border border-gray-2 dark:border-dark-3 min-h-[140px]">
          <img
            class="max-h-28 max-w-full object-contain rounded"
            :src="getProductImageUrl(product?.image)"
            :alt="product?.name ? product.name + ' cover' : 'Product cover'"
          />
        </div>

        <!-- Card 2: Pricing & Margins -->
        <SummaryCard
          :filter="false"
          :data="[
            { name: 'selling price', value: product?.sell_price !== undefined ? '$' + Number(product.sell_price).toFixed(2) : '-' },
            { name: 'cost price', value: product?.cost_price !== undefined ? '$' + Number(product.cost_price).toFixed(2) : '-' },
            { name: 'profit margin', value: profitMargin },
          ]"
        >
          <template #icon>
            <IMoney width="18" height="18" class="summary-icon" />
          </template>
        </SummaryCard>

        <!-- Card 3: Stock & Fulfillment -->
        <SummaryCard
          :filter="false"
          :data="[
            { name: 'in stock', value: product?.stock ?? 0 },
            { name: 'category', value: product?.category || '-' },
            { name: 'delivery', value: Array.isArray(product?.delivery_type) ? (product.delivery_type.join(', ') || 'Standard') : (product?.delivery_type || 'Standard') },
          ]"
        >
          <template #icon>
            <IInventory width="18" height="18" class="summary-icon" />
          </template>
        </SummaryCard>

        <!-- Card 4: Sales & Orders Performance -->
        <SummaryCard
          :filter="false"
          :data="[
            { name: 'units sold', value: totalUnitsSold },
            { name: 'total revenue', value: '$' + totalRevenueFormatted },
            { name: 'orders count', value: orderItems?.length || 0 },
          ]"
        >
          <template #icon>
            <IShoppingBag width="18" height="18" class="summary-icon" />
          </template>
        </SummaryCard>
      </div>

      <!-- Orders containing this product table with client sorting -->
      <BaseTable
        :show-search="false"
        table-name="product-order-items"
        table-title="Orders with this product"
        :data="sortedOrderItems"
        :items-count="orderItems?.length || 0"
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
          <tbody v-if="sortedOrderItems && sortedOrderItems.length > 0">
            <tr v-for="item in sortedOrderItems" :key="item.order_id" class="hover:surface-2 transition-colors">
              <TableBodyCell :value="`#${item.order_id}`" variant="link" :to="`/orders/${item.order_id}`" class="font-mono tabular-nums text-xs" />
              <TableBodyCell :value="item.created_at" variant="date" />
              <TableBodyCell :value="item.quantity" class="font-mono tabular-nums" />
              <TableBodyCell :value="item.discount ? item.discount + '%' : '-'" class="font-mono tabular-nums" />
              <TableBodyCell :value="item.status" variant="chip" :chip-status="item.status" />
            </tr>
          </tbody>
          <tbody v-else>
            <tr>
              <td colspan="5" class="py-12 text-center">
                <div class="flex flex-col items-center justify-center gap-2">
                  <IShoppingBag width="36" height="36" class="typo-clr-muted opacity-40 mb-1" />
                  <p class="typo-base font-medium typo-clr-base">No orders yet</p>
                  <p class="typo-sm typo-clr-muted">This product has not been included in any customer orders yet.</p>
                </div>
              </td>
            </tr>
          </tbody>
        </template>
      </BaseTable>
    </section>
  </main>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { useDateFormat } from '@vueuse/core'
import type { OrderItem, Product } from 'types'
import { productService } from '~/services/productService'
import { getProductImageUrl } from '~/services/imageUtils'
import { useMessage } from '~/composables/message'
import Btn from '~/components/Btn.vue'
import Chip from '~/components/Chip.vue'
import SummaryCard from '~/components/SummaryCard.vue'
import BaseTable from '~/components/BaseTable.vue'
import TableHeaderCell from '~/components/TableHeaderCell.vue'
import TableBodyCell from '~/components/TableBodyCell.vue'
import { IInventory, IShoppingBag, ITrash, IMoney } from '~/components/icons'

const route = useRoute()
const router = useRouter()

const hasError = ref(false)
const product = ref<Product | null>(null)
const orderItems = ref<OrderItem[] | null>(null)
const isLoading = ref(false)
const isDeleting = ref(false)
const dialogUnpublish = ref<HTMLDialogElement | null>(null)
const dialogDelete = ref<HTMLDialogElement | null>(null)

const sortColumn = ref('created_at')
const sortAscending = ref(false)

const productId = computed<number>(() => {
  if (typeof route.params.id === 'string') return +route.params.id
  return -1
})

const headers = [
  { key: 'order_id', label: 'Order ID' },
  { key: 'created_at', label: 'Order Date' },
  { key: 'quantity', label: 'Quantity' },
  { key: 'discount', label: 'Discount' },
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

const sortedOrderItems = computed(() => {
  if (!orderItems.value) return []
  const list = [...orderItems.value]
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

const totalUnitsSold = computed(() => {
  if (!orderItems.value) return 0
  return orderItems.value.reduce((sum, item) => sum + (item.quantity || 1), 0)
})

const totalRevenue = computed(() => {
  if (!orderItems.value || !product.value?.sell_price) return 0
  return totalUnitsSold.value * product.value.sell_price
})

const totalRevenueFormatted = computed(() => {
  return Number(totalRevenue.value).toFixed(2)
})

const profitMargin = computed(() => {
  if (!product.value || product.value.sell_price == null || product.value.cost_price == null) return '-'
  if (product.value.sell_price === 0) return '0%'
  const profit = product.value.sell_price - product.value.cost_price
  const pct = Math.round((profit / product.value.sell_price) * 100)
  return `${pct}%`
})

async function confirmUnpublish() {
  if (!product.value) return
  isLoading.value = true
  const res = await productService.togglePublishStatus(product.value.id)
  isLoading.value = false
  dialogUnpublish.value?.close()
  if (res.error) return useMessage('error', res.error.message || 'An error has occurred')
  if (res.data) product.value = res.data
  useMessage('success', `Product is now unpublished`)
}

async function handleDirectPublish() {
  if (!product.value) return
  isLoading.value = true
  const res = await productService.togglePublishStatus(product.value.id)
  isLoading.value = false
  if (res.error) return useMessage('error', res.error.message || 'An error has occurred')
  if (res.data) product.value = res.data
  useMessage('success', `Product is now published`)
}

async function confirmDelete() {
  if (!product.value) return
  isDeleting.value = true
  const res = await productService.deleteProduct(product.value.id)
  isDeleting.value = false
  dialogDelete.value?.close()
  if (res.error) return useMessage('error', res.error.message || 'An error has occurred')
  useMessage('success', `Product deleted successfully`)
  router.push('/products')
}

onMounted(async () => {
  try {
    const data = await productService.getProductById(productId.value)
    if (!data) {
      hasError.value = true
      return
    }
    product.value = data
    orderItems.value = await productService.getProductOrderItems(data.id)
  } catch (err: any) {
    hasError.value = true
    useMessage('error', err.message || 'An error has occurred')
  }
})
</script>
