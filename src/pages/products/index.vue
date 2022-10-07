<template>
  <main class="p4 flex flex-col gap-y-4 h-screen">
    <!-- header -->
    <header class="flex justify-between items-center">
      <!-- Page title -->
      <h1 class="typo-lg">Products</h1>
      <router-link
        to="/products/details"
        class="flex items-center gap-x-2 fill-primary-2 rounded-md pl-2 pr-4 py-1 typo-clr-on-primary typo-sm"
      >
        <IAdd />
        new product
      </router-link>
    </header>

    <!-- summary cards -->
    <div class="grid grid-cols-3 gap-x-4 row-span-1">
      <SummaryCard
        :data="[
          { name: 'all products', value: store.productsCount },
          { name: 'pending', value: '50' },
          { name: 'completed', value: '400' },
        ]"
      >
        <template #icon>
          <IShoppingBag width="18" height="18" class="summary-icon" />
        </template>
      </SummaryCard>

      <SummaryCard
        :data="[
          { name: 'canceled products', value: '30' },
          { name: 'returned', value: '10' },
          { name: 'damaged', value: '0' },
        ]"
      >
        <template #icon>
          <IShoppingBag width="18" height="18" class="summary-icon" />
        </template>
      </SummaryCard>

      <SummaryCard
        :data="[
          { name: 'abandoned carts', value: '20%' },
          { name: 'customers', value: '30' },
        ]"
      >
        <template #icon>
          <IShoppingBag width="18" height="18" class="summary-icon" />
        </template>
      </SummaryCard>
    </div>

    <!-- datatable  -->
    <ProductsTable />
  </main>
</template>

<script setup lang="ts">
import { useProductsStore } from '~/store/products'

const store = useProductsStore()
</script>
