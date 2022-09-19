<script setup lang="ts">
const data = {
  headings: ['customer name', 'order date', 'order type', 'tracking ID', 'order total', 'action', 'status'],
  rows: [
    'sherif hassan idris',
    '12 Aug 2022 - 12:25 am',
    'home delivary',
    '9348fjr73',
    '₦25,000.00',
    'completed',
    'in progress',
  ],
}
</script>

<template>
  <main class="p4 grid gap-y-4">
    <header class="flex justify-between items-center">
      <h1 class="font-semibold capitalize">orders summary</h1>
      <button class="flex items-center gap-x-2 bg-primary-90 rounded-3 pr4 pl2 py1 text-white text-3 capitalize">
        <IAdd />
        add new order
      </button>
    </header>
    <div class="grid grid-cols-3 gap-x-4">
      <SummaryCard />
      <SummaryCard />
      <SummaryCard />
    </div>
    <div class="bg-surface p4 rounded-3">
      <caption class="py4 flex items-center gap-x-2 font-semibold capitalize">
        <h1>customers orders</h1>
        <div class="px2 py1 border text-3 rounded ml-auto border-line flex items-center gap-x-2">
          <Isearch width="14" height="14" />
          <input type="search" placeholder="search.." class="focus:outline-none" />
        </div>
        <!-- filter general menu -->
        <FilterMenu />
        <!-- filter by date menu  -->
        <FilterDate />
        <button class="border border-line px2 py1 text-3 rounded flex items-center gap-x-2">
          Bulk Action <ICaretDown width="14" height="14" />
        </button>
      </caption>
      <DataTable :data="data" />
    </div>
  </main>
</template>
