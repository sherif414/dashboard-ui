<script setup lang="ts"></script>

<template>
  <main class="grid grid-cols-3 grid-rows-1 gap-x-6 pl-24 pb-4 pr-4 pt-16 h-full">
    <section class="col-span-2 grid grid-cols-2 gap-4 px-2 overflow-y-auto">
      <!-- sales summary -->
      <SummaryCard
        :data="[
          { name: 'sales', value: '400,000,00', growth: '+ 125%' },
          { name: 'volume', value: 450, growth: '+20' },
        ]"
      >
        <template #icon>
          <IChart width="16" height="16" class="summary-icon" />
        </template>
      </SummaryCard>

      <!-- customers summary -->
      <SummaryCard
        :data="[
          { name: 'cusomters', value: '1,250', growth: '+100' },
          { name: 'active', value: '1,050', growth: '+80' },
        ]"
      >
        <template #icon>
          <ICustomers width="16" height="16" class="summary-icon" />
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
          <IShoppingBag width="16" height="16" class="summary-icon" />
        </template>
      </SummaryCard>

      <!-- products summary -->
      <SummaryCard
        :data="[
          { name: 'all products', value: '90' },
          { name: 'active', value: '50', growth: '+20%' },
        ]"
        class="bg-indigo-5 dark:bg-violet-6 text-gray-1"
      >
        <template #icon>
          <IInventory width="16" height="16" class="summary-icon" />
        </template>
      </SummaryCard>
      <GraphBar type="line" chart-id="chart1" class="col-span-2" />
    </section>
    <RecentOrders />
  </main>
</template>
