<template>
  <article class="z-0 p4 flex flex-col gap-y-4 justify-between rounded-3 text-3 relative">
    <header class="flex justify-between">
      <h2 class="text-4 font-medium text-black-50">Marketing</h2>
      <h3>this week</h3>
    </header>
    <ol class="flex justify-between list-disc pl-4">
      <li>Acquisition</li>
      <li>Purchase</li>
      <li>Retention</li>
    </ol>
    <div id="chart-donut" class="m-auto"></div>
  </article>
</template>

<script setup lang="ts">
import { PieChart } from 'chartist'
import type { PieChartData, PieChartOptions } from 'chartist'

const data: PieChartData = {
  series: [10, 30, 60],
  labels: ['A', 'P', 'R'],
}

const options: PieChartOptions = {
  donut: true,
  donutWidth: 24,
  width: '100%',
  height: '100%',
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
  --at-apply: stroke-indigo-3;
}
#chart-donut .ct-series-c .ct-slice-donut {
  --at-apply: stroke-indigo-5;
}
#chart-donut .ct-label {
  fill: black;
}

#chart-donut .ct-series:hover {
  box-shadow: 2px 2px 2px 2px rgb(133, 30, 30);
}
</style>
