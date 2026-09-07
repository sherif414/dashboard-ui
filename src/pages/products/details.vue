<template>
  <main class="grid place-items-center w-full h-full p8" v-if="hasError">
    <h1 class="typo-head text-xl">Product was not found</h1>
    <router-link to="/products" class="typo-clr-primary mt-4 hover:underline">Back to products</router-link>
  </main>
  <main v-else class="flex flex-col gap-4 p4">
    <header class="flex gap-8 items-center typo-head">
      <h1>{{ product?.name ?? '-' }}</h1>
      <h2>
        Date added: <span class="typo-clr-muted typo-sm">{{ product?.created_at ? new Date(product.created_at).toDateString() : '-' }}</span>
      </h2>
      <h2>
        product id: <span class="typo-clr-muted typo-sm">{{ route.params.id }}</span>
      </h2>
      <div class="ml-auto">
        <Btn
          :loading="isLoading"
          class="ml-auto typo-sm"
          :class="
            !product?.published
              ? 'bg-black! text-gray-1! dark:bg-gray-1! dark:text-dark!'
              : 'bg-error! bg-opacity-10! text-error! hover:bg-error! hover:bg-opacity-30!'
          "
          @click="handleChangeState"
          >{{ product?.published ? 'unpublish' : 'publish' }} product</Btn
        >
      </div>
    </header>
    <section class="flex flex-col gap-4 w-full h-full">
      <div class="grid grid-cols-8 gap-4">
        <div class="rounded-md surface-1 p2 flex items-center justify-center">
          <img class="max-h-32 object-cover rounded" :src="getProductImageUrl(product?.image)" />
        </div>
        <SummaryCard
          :data="[
            { name: 'price', value: product?.sell_price ? '$' + product.sell_price : '-' },
            { name: 'status', value: product?.published ? 'published' : 'unpublished' },
            { name: 'in-stock', value: product?.stock },
          ]"
          class="col-span-3"
        >
          <template #icon>
            <IInventory width="18" height="18" class="summary-icon" />
          </template>
        </SummaryCard>

        <SummaryCard :data="[{ name: 'total orders', value: orderItems?.length || 0 }]" class="col-span-2">
          <template #icon>
            <IInventory width="18" height="18" class="summary-icon" />
          </template>
        </SummaryCard>

        <SummaryCard
          :data="[
            { name: 'views', value: '1,500' },
            { name: 'favorites', value: '350' },
          ]"
          class="col-span-2"
        >
          <template #icon>
            <IInventory width="18" height="18" class="summary-icon" />
          </template>
        </SummaryCard>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <SummaryCard
          :data="[
            { name: 'all orders', value: orderItems?.length || 0, growth: '+24%' },
            { name: 'pending', value: pendingCount },
            { name: 'complete', value: completedCount },
          ]"
          class="col-span-1"
        >
          <template #icon>
            <IShoppingBag width="18" height="18" class="summary-icon" />
          </template>
        </SummaryCard>

        <SummaryCard
          :filter="false"
          :data="[
            { name: 'cost price', value: product?.cost_price ? '$' + product.cost_price : '-' },
            { name: 'profit margin', value: profitMargin },
            { name: 'category', value: product?.category },
          ]"
          class="col-span-1"
        >
          <template #icon>
            <IShoppingBag width="18" height="18" class="summary-icon" />
          </template>
        </SummaryCard>
      </div>

      <BaseTable
        :show-search="false"
        table-name="orderItems"
        table-title="orders with this product"
        :data="orderItems"
        :items-count="orderItems?.length || 0"
      >
        <template #header="{ orderBy }">
          <TableHeaderCell
            v-for="head in headers"
            :key="head"
            :sort-ascending="orderBy.ascending"
            :order-by="orderBy.column"
            :column="head"
          >
            {{ head }}
          </TableHeaderCell>
        </template>
        <template #body>
          <tbody v-if="orderItems">
            <tr v-for="item in orderItems" :key="item.order_id">
              <TableBodyCell :value="item.order_id" variant="link" :to="`/orders/${item.order_id}`" />
              <TableBodyCell :value="item.created_at" variant="date" />
              <TableBodyCell :value="item.quantity" />
              <TableBodyCell :value="item.discount ? item.discount + '%' : '$0.00'" />
              <TableBodyCell :value="item.status" variant="chip" :chip-status="item.status === 'completed'" />
            </tr>
          </tbody>
        </template>
      </BaseTable>
    </section>
  </main>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import type { OrderItem, Product } from 'types'
import { productService } from '~/services/productService'
import { getProductImageUrl } from '~/services/imageUtils'
import { useMessage } from '~/composables/message'
import Btn from '~/components/Btn.vue'
import SummaryCard from '~/components/SummaryCard.vue'
import BaseTable from '~/components/BaseTable.vue'
import TableHeaderCell from '~/components/TableHeaderCell.vue'
import TableBodyCell from '~/components/TableBodyCell.vue'
import { IInventory, IShoppingBag } from '~/components/icons'

const route = useRoute()

const hasError = ref(false)
const product = ref<Product | null>(null)
const orderItems = ref<OrderItem[] | null>(null)
const productId = computed<number>(() => {
  if (typeof route.params.id === 'string') return +route.params.id
  return -1
})

const headers = ['order id', 'order date', 'quantity', 'discount', 'status']

const pendingCount = computed(() => orderItems.value?.filter((i) => i.status === 'pending').length ?? 0)
const completedCount = computed(() => orderItems.value?.filter((i) => i.status === 'completed').length ?? 0)
const profitMargin = computed(() => {
  if (!product.value?.sell_price || !product.value?.cost_price) return '-'
  const profit = product.value.sell_price - product.value.cost_price
  const pct = Math.round((profit / product.value.sell_price) * 100)
  return `${pct}%`
})

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

const isLoading = ref(false)
async function handleChangeState() {
  if (!product.value) return
  isLoading.value = true
  const res = await productService.togglePublishStatus(product.value.id)
  isLoading.value = false
  if (res.error) return useMessage('error', res.error.message || 'An error has occurred')
  if (res.data) product.value = res.data
  useMessage('success', `Product is now ${product.value.published ? 'published' : 'unpublished'}`)
}
</script>
