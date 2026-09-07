<script setup lang="ts">
import { onMounted } from 'vue'
import { BarChart } from 'chartist'
import type { BarChartData, BarChartOptions } from 'chartist'

interface Props {
  title?: string
}
const { title = 'Summary' } = defineProps<Props>()

const data: BarChartData = {
  series: [
    [100, 100, 100, 100, 100, 100, 100],
    [20, 80, 20, 60, 40, 40, 80],
  ],
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
}
const options: BarChartOptions = {
  low: 0,
  high: 100,
  width: '100%',
  height: '240px',
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
  <article class="surface-1 border border-gray-2 dark:border-dark-3 rounded-md flex flex-col gap-4 p4">
    <header class="flex gap-4 items-center justify-between">
      <div class="flex items-center gap-2">
        <h2 class="typo-head capitalize">{{ title }}</h2>
        <span class="typo-sm typo-clr-muted">Weekly revenue flow</span>
      </div>
      <span class="typo-sm typo-clr-muted surface-2 px-2.5 py-0.5 rounded border border-gray-2 dark:border-dark-3">Last 7 days</span>
    </header>
    <div id="chart-bar" class="grow typo-clr-base! min-h-240px"></div>
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
