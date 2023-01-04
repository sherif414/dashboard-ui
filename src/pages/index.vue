<template>
  <main class="grid grid-cols-3 grid-rows-[repeat(5,minmax(max-content,1fr))] gap-4 p4 overflow-y-auto">
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
        { name: 'active', value: '67%', growth: '+2%' },
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

    <ChartDonut class="surface-1 row-span-2 rounded-md"></ChartDonut>

    <!-- products summary -->
    <SummaryCard
      :data="[
        { name: 'all products', value: productStore.countAll ?? '' },
        { name: 'active', value: '50', growth: '+20%' },
      ]"
      fill="primary"
    >
      <template #icon>
        <IInventory width="18" height="18" class="summary-icon fill-primary-3 typo-clr-on-primary!" />
      </template>
    </SummaryCard>

    <!-- products summary -->
    <SummaryCard
      :data="[
        { name: 'all products', value: productStore.countAll ?? '' },
        { name: 'active', value: '50', growth: '+20%' },
      ]"
    >
      <template #icon>
        <IInventory width="18" height="18" class="summary-icon" />
      </template>
    </SummaryCard>

    <RecentOrders class="row-span-4 col-start-3 row-start-2" />

    <!-- data visualization -->
    <ChartBar title="sales" class="col-span-2 row-span-2" />
  </main>
</template>

<script setup lang="ts">
import { useProductsStore } from '~/store/products'
import { useCustomersStore } from '~/store/customers'

const productStore = useProductsStore()
const customerStore = useCustomersStore()

onMounted(() => {
  productStore.getCount()
  customerStore.getCount()
})
</script>
