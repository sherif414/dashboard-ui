<template>
  <main class="grid grid-cols-3 grid-rows-1 gap-x-6 p4 h-screen">
    <section class="col-span-2 grid grid-cols-2 pr-2 gap-4 overflow-y-auto">
      <!-- sales summary -->
      <SummaryCard
        :data="[
          { name: 'sales', value: '400,000,00', growth: '+ 125%' },
          { name: 'volume', value: 450, growth: '+20' },
        ]"
      >
        <template #icon>
          <IChart width="18" height="18" class="summary-icon" />
        </template>
      </SummaryCard>

      <!-- customers summary -->
      <SummaryCard
        :data="[
          { name: 'cusomters', value: customers ? customers.length : '', growth: '+1' },
          { name: 'active', value: '1,050', growth: '+80' },
        ]"
      >
        <template #icon>
          <ICustomers width="18" height="18" class="summary-icon" />
        </template>
      </SummaryCard>

      <!-- orders summary -->
      <SummaryCard
        :data="[
          { name: 'all orders', value: '450' },
          { name: 'pending', value: '50' },
          { name: 'completed', value: '400' },
        ]"
      >
        <template #icon>
          <IShoppingBag width="18" height="18" class="summary-icon" />
        </template>
      </SummaryCard>

      <!-- products summary -->
      <SummaryCard
        :data="[
          { name: 'all products', value: products ? products.length : '' },
          { name: 'active', value: '50', growth: '+20%' },
        ]"
        fill="fill-primary-2 typo-clr-on-primary"
      >
        <template #icon>
          <IInventory width="18" height="18" class="summary-icon fill-primary-3" />
        </template>
      </SummaryCard>

      <!-- data visualization -->
      <ChartLine class="col-span-full" />
      <ChartBar class="col-span-full" />
    </section>
    <RecentOrders />
  </main>
</template>

<script setup lang="ts">
import { useProductsStore } from '~/store/products'
import { useCustomersStore } from '~/store/customers'
import { storeToRefs } from 'pinia'

const { productsList: products } = storeToRefs(useProductsStore())
const { customersList: customers } = storeToRefs(useCustomersStore())
</script>
