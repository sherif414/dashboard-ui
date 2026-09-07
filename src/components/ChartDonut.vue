<template>
  <article class="surface-1 border border-gray-2 dark:border-dark-3 p4 flex flex-col gap-y-4 justify-between rounded-md text-3 relative">
    <header class="flex justify-between items-center">
      <h2 class="typo-head typo-clr-base">Marketing</h2>
      <span class="typo-sm typo-clr-muted">This week</span>
    </header>
    <div class="flex items-center justify-around gap-2 typo-sm">
      <div class="flex items-center gap-1.5">
        <span class="w-2.5 h-2.5 rounded-full bg-accent-6"></span>
        <span class="typo-clr-muted text-12px">Acquisition (10%)</span>
      </div>
      <div class="flex items-center gap-1.5">
        <span class="w-2.5 h-2.5 rounded-full bg-indigo-3 dark:bg-violet-3"></span>
        <span class="typo-clr-muted text-12px">Purchase (30%)</span>
      </div>
      <div class="flex items-center gap-1.5">
        <span class="w-2.5 h-2.5 rounded-full bg-indigo-5 dark:bg-violet-5"></span>
        <span class="typo-clr-muted text-12px">Retention (60%)</span>
      </div>
    </div>
    <div id="chart-donut" class="m-auto w-full flex justify-center items-center py-2"></div>
  </article>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { PieChart } from 'chartist'
import type { PieChartData, PieChartOptions } from 'chartist'

const data: PieChartData = {
  series: [10, 30, 60],
  labels: ['A', 'P', 'R'],
}

const options: PieChartOptions = {
  donut: true,
  donutWidth: 24,
  width: '200px',
  height: '200px',
  high: 100,
  low: 0,
  total: 100,
}

onMounted(() => {
  new PieChart('#chart-donut', data, options)
})
</script>

<style>
#chart-donut .ct-series-a .ct-slice-donut {
  --at-apply: stroke-accent-6;
}
#chart-donut .ct-series-b .ct-slice-donut {
  --at-apply: stroke-indigo-3 dark:stroke-violet-3;
}
#chart-donut .ct-series-c .ct-slice-donut {
  --at-apply: stroke-indigo-5 dark:stroke-violet-5;
}
#chart-donut .ct-label {
  fill: currentColor;
  --at-apply: typo-clr-base font-bold text-12px;
}
</style>
