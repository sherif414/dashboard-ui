<script setup lang="ts">
const data = {
  headings: ['customer name', 'order date', 'order type', 'tracking ID', 'order total', 'action', 'status'],
  rows: ['sherif hassan idris', '12 Aug 2022 - 12:25 am', 'home delivary', '9348fjr73', '₦25,000.00'],
}
</script>

<template>
  <main class="p4 flex flex-col gap-y-4 pt-16 pl-20 h-full">
    <header class="flex justify-between items-center">
      <h1 class="font-semibold capitalize">orders summary</h1>
      <button
        class="flex items-center gap-x-2 bg-primary-90 dark:bg-violet-6 rounded-3 pr4 pl2 py1 text-white text-3 capitalize"
      >
        <IAdd />
        add new order
      </button>
    </header>
    <div class="grid grid-cols-3 gap-x-4 row-span-1">
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

      <!-- orders summary -->
      <SummaryCard
        :data="[
          { name: 'canceled', value: '30' },
          { name: 'returned', value: '10' },
          { name: 'damaged', value: '0' },
        ]"
      >
        <template #icon>
          <IShoppingBag width="16" height="16" class="summary-icon" />
        </template>
      </SummaryCard>

      <!-- orders summary -->
      <SummaryCard
        :data="[
          { name: 'abandoned carts', value: '20%' },
          { name: 'customers', value: '30' },
        ]"
      >
        <template #icon>
          <IShoppingBag width="16" height="16" class="summary-icon" />
        </template>
      </SummaryCard>
    </div>
    <div class="surface p4 rounded-3 flex flex-col gap-y-4 grow overflow-auto">
      <caption class="flex items-center gap-x-2 font-semibold capitalize">
        <h1>customers orders</h1>
        <div class="px2 py1 border text-3 rounded ml-auto dark:border-line border-gray-3 flex items-center gap-x-2">
          <Isearch width="14" height="14" class="[&_path]:dark:stroke-gray-1" />
          <input type="search" placeholder="search.." class="focus:outline-none bg-inherit" />
        </div>
        <!-- filter general menu -->
        <FilterMenu />
        <!-- filter by date menu  -->
        <FilterDate />
        <button class="border dark:border-line border-gray-3 px2 py1 text-3 rounded flex items-center gap-x-2">
          Bulk Action <ICaretDown width="14" height="14" class="[&_path]:dark:stroke-gray-1" />
        </button>
      </caption>
      <DataTable :data="data" />
    </div>
  </main>
</template>
