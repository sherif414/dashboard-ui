<template>
  <main class="grid grid-cols-3 grid-rows-1 gap-x-6 p4 h-screen p-4 pl-5rem pt-5rem">
    <section class="col-span-2 grid 2xl:px-8 grid-cols-2 pr-2 gap-4 overflow-y-auto">
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
          { name: 'customers', value: customerStore.countAll ?? '', growth: '+1' },
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
          { name: 'all products', value: productStore.countAll ?? '' },
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
    <RecentOrders :data="productStore.products" />
  </main>
</template>

<script setup lang="ts">
import { useProductsStore } from '~/store/products'
import { useCustomersStore } from '~/store/customers'

const productStore = useProductsStore()
const customerStore = useCustomersStore()

onMounted(() => {
  productStore.getCount()
  productStore.getProducts({ orderBy: 'created_at', ascending: false, itemsPerPage: 50, page: 1 })
  customerStore.getCount()
})
</script>
