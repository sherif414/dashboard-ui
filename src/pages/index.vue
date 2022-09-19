<script setup lang="ts"></script>

<template>
  <main class="grid grid-cols-3 grid-rows-1 gap-x-8 pl-20 pb-4 pr-4 pt-16 h-screen">
    <section class="col-span-2 grid grid-cols-2 grid-rows-5 gap-4 overflow-y-auto">
      <SummaryCard class="" />
      <SummaryCard class="text-white! bg-violet-600" />
      <GraphBar type="line" chart-id="chart1" class="col-span-2 row-span-2" />
      <GraphBar type="bar" chart-id="chart2" class="col-span-2 row-span-2" />
    </section>
    <RecentOrders />
  </main>
</template>
