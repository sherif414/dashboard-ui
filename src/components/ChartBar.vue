<script setup lang="ts">
import { BarChart } from 'chartist'
import type { BarChartData, BarChartOptions } from 'chartist'

const data: BarChartData = {
  series: [
    [100, 100, 100, 100, 100, 100, 100],
    [20, 80, 20, 60, 40, 40, 80],
  ],
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'sun'],
}
const options: BarChartOptions = {
  low: 0,
  high: 100,
  width: '100%',
  height: '100%',
  seriesBarDistance: 0,

  axisX: {
    offset: 30,
  },
  axisY: {
    offset: 30,
  },
}

onMounted(() => {
  new BarChart('#chart-bar', data, options)
})
</script>

<template>
  <article class="surface-1 rounded-3 flex flex-col gap-4 p4">
    <header class="flex gap-4 items-center hidden!">
      <h2 class="typo-head">summary</h2>
      <span>sales</span><span class="ml-auto">last 7 days</span>
    </header>
    <div id="chart-bar" class="grow typo-clr-base!"></div>
  </article>
</template>

<style>
.ct-vertical,
.ct-horizontal {
  stroke: none;
}

#chart-bar .ct-bar {
  stroke: var(--clr-primary) !important;
  stroke-linecap: round;
  stroke-width: 13px;
}

#chart-bar .ct-label {
  margin-top: 1rem;
}

.dark .ct-label {
  color: white;
}

#chart-bar .ct-series-a .ct-bar {
  stroke: gray !important;
  stroke-opacity: 0.1;
}
</style>
