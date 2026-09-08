<script setup lang="ts">
import { ref, onMounted, watch, onBeforeUnmount } from 'vue'
import { BarChart } from 'chartist'
import type { BarChartData, BarChartOptions } from 'chartist'

interface Props {
  title?: string
  labels?: string[]
  series?: number[][]
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Sales Flow',
  labels: () => ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  series: () => [
    [100, 100, 100, 100, 100, 100, 100],
    [25, 75, 40, 85, 60, 45, 90],
  ],
})

const chartEl = ref<HTMLElement | null>(null)
let chartInstance: BarChart | null = null

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

function renderChart() {
  if (!chartEl.value) return

  const chartData: BarChartData = {
    labels: props.labels,
    series: props.series,
  }

  if (chartInstance) {
    chartInstance.update(chartData)
  } else {
    chartInstance = new BarChart(chartEl.value, chartData, options)
  }
}

onMounted(() => {
  renderChart()
})

watch(() => [props.labels, props.series], () => {
  renderChart()
}, { deep: true })

onBeforeUnmount(() => {
  if (chartInstance) {
    chartInstance.detach()
    chartInstance = null
  }
})
</script>

<template>
  <article class="surface-1 border border-gray-2 dark:border-dark-3 rounded-md flex flex-col gap-4 p4 sm:p5 shadow-sm">
    <header class="flex gap-4 items-center justify-between flex-wrap">
      <div class="flex items-center gap-2">
        <h2 class="typo-head capitalize typo-clr-base">{{ title }}</h2>
        <span class="typo-sm typo-clr-muted hidden sm:inline">Daily velocity index</span>
      </div>
      <div class="flex items-center gap-3">
        <div class="flex items-center gap-1.5 text-11px typo-clr-muted">
          <span class="w-2.5 h-2.5 rounded-full bg-indigo-5 dark:bg-violet-5"></span>
          <span>Actual</span>
        </div>
        <span class="typo-sm typo-clr-muted surface-2 px-2.5 py-0.5 rounded border border-gray-2 dark:border-dark-3">
          Last 7 days
        </span>
      </div>
    </header>
    <div
      ref="chartEl"
      class="bar-chart-container grow typo-clr-base! min-h-240px"
      role="img"
      aria-label="Weekly revenue bar chart"
    ></div>
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
