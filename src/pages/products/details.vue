<template>
  <main v-if="product" class="w-full h-full flex flex-col gap-4 p4 pt-5rem pl-5rem">
    <header class="flex gap-8 items-center typo-head">
      <h1>{{ product.name }}</h1>
      <h2>
        Date added: <span class="typo-clr-muted typo-sm">{{ new Date(product.created_at).toDateString() }}</span>
      </h2>
      <h2>
        product id: <span class="typo-clr-muted typo-sm">{{ $route.params.id }}</span>
      </h2>
      <div class="ml-auto">
        <button class="p3 py-1 rounded-md typo-base" type="button">Edit product</button>
        <button class="p3 py-1 typo-clr-on-primary bg-black rounded-md typo-base" type="button">
          unpublish product
        </button>
      </div>
    </header>
    <section class="flex flex-col gap-4 w-full h-full">
      <div class="grid grid-cols-8 gap-4">
        <div class="col-span-1 fill-primary-2 rounded-md"></div>
        <SummaryCard
          :data="[
            { name: 'price', value: product.sell_price },
            { name: 'in-stock', value: product.stock },
          ]"
          class="col-span-3"
        >
          <template #icon>
            <IInventory width="18" height="18" class="summary-icon fill-primary-3" />
          </template>
        </SummaryCard>

        <SummaryCard :data="[{ name: 'total orders', value: '1000' }]" class="col-span-2">
          <template #icon>
            <IInventory width="18" height="18" class="summary-icon fill-primary-3" />
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
            <IInventory width="18" height="18" class="summary-icon fill-primary-3" />
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

      <BaseTable class="grow" table-name="product detail" :data="null" />
    </section>
  </main>
  <main class="grid place-items-center w-full h-full" v-if="hasError">
    <h1>product was not found</h1>
  </main>
</template>

<script setup lang="ts">
import type { Product } from 'types'
import { supabase } from '~/api'

const route = useRoute()

let hasError = $ref(false)
let product = $ref<Product | null>(null)
let productId = $computed<number>(() => {
  if (typeof route.params.id === 'string') return parseInt(route.params.id)
  return -1
})

onMounted(() => {
  supabase
    .from('products')
    .select('*')
    .eq('id', productId)
    .then(({ data, error }) => {
      if (data) {
        hasError = false
        product = data[0]
      } else if (error) {
        hasError = true
        product = null
      }
    })
})
</script>
