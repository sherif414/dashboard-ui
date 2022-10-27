<template>
  <main class="p4 pt-5rem pl-5rem flex flex-col gap-y-4 h-full overflow-y-auto">
    <!-- header -->
    <router-link
      to="/products/add"
      class="fixed bottom-24 right-20 fill-primary-2 hover:fill-primary-3 transition typo-clr-on-primary rounded-full p-3 shadow-lg"
    >
      <IAdd />
    </router-link>

    <!-- summary cards -->
    <div class="grid grid-cols-2 gap-x-6 row-span-1">
      <SummaryCard
        fill="fill-primary-2 typo-clr-on-primary"
        :data="[
          { name: 'all products', value: store.productsCount },
          { name: 'published', value: store.publishedProducts },
          { name: 'unpublished', value: unpublishedProducts },
        ]"
      >
        <template #icon>
          <IInventory width="18" height="18" class="summary-icon fill-primary-3" />
        </template>
      </SummaryCard>

      <SummaryCard
        :data="[
          { name: 'out of stock', value: '5' },
          { name: 'expired', value: '2' },
          { name: '1 star rating', value: '3' },
        ]"
      >
        <template #icon>
          <IInventory width="18" height="18" class="summary-icon" />
        </template>
      </SummaryCard>
    </div>

    <!-- data-table  -->
    <ProductsTable />
  </main>
</template>

<script setup lang="ts">
import { useProductsStore } from '~/store/products'

const unpublishedProducts = $computed<number | null>(() => {
  if (store.productsCount && store.publishedProducts) return store.productsCount - store.publishedProducts
  return null
})
const store = useProductsStore()
onMounted(() => {
  store.getProductsCount()
  store.getProductList()
})
</script>
