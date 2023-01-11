<template>
  <main class="grid place-items-center w-full h-full" v-if="hasError">
    <h1>product was not found</h1>
  </main>
  <main v-else class="flex flex-col gap-4 p4">
    <header class="flex gap-8 items-center typo-head">
      <h1>{{ product?.name ?? '-' }}</h1>
      <h2>
        Date added: <span class="typo-clr-muted typo-sm">{{ new Date(product?.created_at ?? '').toDateString() }}</span>
      </h2>
      <h2>
        product id: <span class="typo-clr-muted typo-sm">{{ $route.params.id }}</span>
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
        <div class="rounded-md surface-1">
          <img class="bg-cover" src="../../assets/img/iphone14.png" />
        </div>
        <SummaryCard
          :data="[
            { name: 'price', value: product?.sell_price },
            { name: 'status', value: product?.published ? 'published' : 'unpublished' },
            { name: 'in-stock', value: product?.stock },
          ]"
          class="col-span-3"
        >
          <template #icon>
            <IInventory width="18" height="18" class="summary-icon" />
          </template>
        </SummaryCard>

        <SummaryCard :data="[{ name: 'total orders', value: '1000' }]" class="col-span-2">
          <template #icon>
            <IInventory width="18" height="18" class="summary-icon" />
          </template>
        </SummaryCard>

        <SummaryCard
          :data="[
            { name: 'views', value: '1500' },
            { name: 'favorites', value: 350 },
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
            { name: 'all orders', value: 735, growth: '+24%' },
            { name: 'pending', value: 30 },
            { name: 'complete', value: 705 },
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
            { name: 'canceled orders', value: 17 },
            { name: 'returned products', value: 3 },
            { name: 'damaged products', value: 0 },
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
        table-title="orders"
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
            <tr v-for="item in orderItems" :key="item.product_id">
              <TableBodyCell :value="item.order_id" variant="link" :to="`/orders/${item.order_id}`" />
              <TableBodyCell :value="item.created_at" variant="date" />
              <TableBodyCell :value="item.quantity" />
              <TableBodyCell :value="item.discount" />
              <TableBodyCell :value="item.status" variant="chip" :chip-status="item.status === 'completed'" />
            </tr>
          </tbody>
        </template>
        <template #pagination></template>
      </BaseTable>
    </section>
  </main>
</template>

<script setup lang="ts">
import type { OrderItem, Product } from 'types'
import { supabase } from '~/api'

const route = useRoute()

let hasError = $ref(false)
let product = $ref<Product | null>(null)
let orderItems = $ref<OrderItem[] | null>(null)
let productId = $computed<number>(() => {
  if (typeof route.params.id === 'string') return +route.params.id
  return -1
})

const headers = ['order id', 'order date', 'quantity', 'discount', 'status']

// load initial data
onMounted(async () => {
  const { data, error } = await supabase.from('products').select('*').eq('id', productId).single()
  if (error && !data) return useMessage('error', error.message || 'an error has occurred')
  product = data

  const res = await supabase.from('order_item').select('*').eq('product_id', data.id)
  if (res.error) return useMessage('error', res.error.message || 'an error has occurred')
  orderItems = res.data
})

// change publish status
let isLoading = $ref(false)
async function handleChangeState() {
  if (!product) return
  isLoading = true
  const { error } = await supabase.from('products').update({ published: !product.published }).eq('id', product.id)
  isLoading = false
  if (error) return useMessage('error', error.message || 'an error has occurred')
  product.published = !product.published
  useMessage('success', 'action successful')
}
</script>
