<template>
  <main class="flex flex-col gap-6 p4 lg:p6 overflow-y-auto w-full">
    <!-- top summary metrics -->
    <section class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 w-full">
      <!-- sales summary -->
      <SummaryCard
        :data="[
          { name: 'sales', value: '$8,333.00', growth: '+12.5%' },
          { name: 'volume', value: '450', growth: '+20' },
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
          { name: 'active', value: '80%', growth: '+2%' },
        ]"
      >
        <template #icon>
          <ICustomers width="18" height="18" class="summary-icon" />
        </template>
      </SummaryCard>

      <!-- orders summary -->
      <SummaryCard
        :data="[
          { name: 'all orders', value: '8' },
          { name: 'pending', value: '3' },
          { name: 'completed', value: '5' },
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
          { name: 'active', value: productStore.countPublished ?? '0', growth: '+20%' },
        ]"
        fill="primary"
      >
        <template #icon>
          <IInventory width="18" height="18" class="summary-icon fill-primary-3 typo-clr-on-primary!" />
        </template>
      </SummaryCard>
    </section>

    <!-- analytical body & recent activity -->
    <section class="grid grid-cols-1 xl:grid-cols-3 gap-6 w-full items-start">
      <!-- visual charts -->
      <div class="xl:col-span-2 flex flex-col gap-6 w-full">
        <ChartBar title="sales" />
        <ChartDonut />
      </div>

      <!-- recent orders activity panel -->
      <div class="xl:col-span-1 w-full">
        <RecentOrders />
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useProductsStore } from '~/store/products'
import { useCustomersStore } from '~/store/customers'
import SummaryCard from '~/components/SummaryCard.vue'
import ChartDonut from '~/components/ChartDonut.vue'
import ChartBar from '~/components/ChartBar.vue'
import RecentOrders from '~/components/RecentOrders.vue'
import { IChart, ICustomers, IShoppingBag, IInventory } from '~/components/icons'

const productStore = useProductsStore()
const customerStore = useCustomersStore()

onMounted(() => {
  productStore.getCount()
  customerStore.getCount()
})
</script>
