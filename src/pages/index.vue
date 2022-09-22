<script setup lang="ts"></script>

<template>
  <main class="grid grid-cols-3 grid-rows-1 gap-x-6 pl-24 pb-4 pr-4 pt-16 h-full">
    <section class="col-span-2 grid grid-cols-2 gap-4 px-2 overflow-y-auto">
      <SummaryCard class="" />
      <SummaryCard class="text-white! bg-indigo-5 dark:bg-violet-6" />
      <SummaryCard class="text-white! bg-indigo-5 dark:bg-violet-6" />
      <SummaryCard class="" />
      <GraphBar type="line" chart-id="chart1" class="col-span-2" />
    </section>
    <RecentOrders />
  </main>
</template>
