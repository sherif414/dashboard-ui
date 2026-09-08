<template>
  <article class="surface-1 border border-gray-2 dark:border-dark-3 p4 sm:p5 flex flex-col gap-y-4 justify-between rounded-md text-3 relative shadow-sm">
    <header class="flex justify-between items-center">
      <h2 class="typo-head typo-clr-base">Order Fulfillment</h2>
      <span class="typo-sm typo-clr-muted surface-2 px-2.5 py-0.5 rounded border border-gray-2 dark:border-dark-3">Status ratio</span>
    </header>
    <div class="grid grid-cols-3 gap-2 typo-sm">
      <div class="flex items-center gap-1.5 min-w-0">
        <span class="w-2.5 h-2.5 rounded-full bg-success shrink-0"></span>
        <span class="typo-clr-muted text-11px sm:text-12px truncate">
          Completed ({{ completedPct }}%)
        </span>
      </div>
      <div class="flex items-center gap-1.5 min-w-0">
        <span class="w-2.5 h-2.5 rounded-full bg-warn shrink-0"></span>
        <span class="typo-clr-muted text-11px sm:text-12px truncate">
          Pending ({{ pendingPct }}%)
        </span>
      </div>
      <div class="flex items-center gap-1.5 min-w-0">
        <span class="w-2.5 h-2.5 rounded-full bg-indigo-5 dark:bg-violet-5 shrink-0"></span>
        <span class="typo-clr-muted text-11px sm:text-12px truncate">
          Other ({{ otherPct }}%)
        </span>
      </div>
    </div>
    <div
      ref="chartEl"
      class="m-auto w-full flex justify-center items-center py-2 min-h-200px"
      role="img"
      aria-label="Order fulfillment ratio donut chart"
    ></div>
  </article>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, onBeforeUnmount } from 'vue'
import { PieChart } from 'chartist'
import type { PieChartData, PieChartOptions } from 'chartist'

interface Props {
  completed?: number
  pending?: number
  cancelled?: number
}

const props = withDefaults(defineProps<Props>(), {
  completed: 5,
  pending: 3,
  cancelled: 0,
})

const total = computed(() => {
  const sum = props.completed + props.pending + props.cancelled
  return sum > 0 ? sum : 1
})

const completedPct = computed(() => Math.round((props.completed / total.value) * 100))
const pendingPct = computed(() => Math.round((props.pending / total.value) * 100))
const otherPct = computed(() => Math.max(0, 100 - completedPct.value - pendingPct.value))

const chartEl = ref<HTMLElement | null>(null)
let chartInstance: PieChart | null = null

const options: PieChartOptions = {
  donut: true,
  donutWidth: 24,
  width: '200px',
  height: '200px',
  high: 100,
  low: 0,
  total: 100,
}

function renderChart() {
  if (!chartEl.value) return

  const data: PieChartData = {
    series: [
      Math.max(5, completedPct.value),
      Math.max(5, pendingPct.value),
      Math.max(5, otherPct.value),
    ],
    labels: [`${completedPct.value}%`, `${pendingPct.value}%`, `${otherPct.value}%`],
  }

  if (chartInstance) {
    chartInstance.update(data)
  } else {
    chartInstance = new PieChart(chartEl.value, data, options)
  }
}

onMounted(() => {
  renderChart()
})

watch(() => [props.completed, props.pending, props.cancelled], () => {
  renderChart()
})

onBeforeUnmount(() => {
  if (chartInstance) {
    chartInstance.detach()
    chartInstance = null
  }
})
</script>

<style>
.ct-series-a .ct-slice-donut {
  --at-apply: stroke-success;
}
.ct-series-b .ct-slice-donut {
  --at-apply: stroke-warn;
}
.ct-series-c .ct-slice-donut {
  --at-apply: stroke-indigo-5 dark:stroke-violet-5;
}
.ct-label {
  fill: currentColor;
  --at-apply: typo-clr-base font-bold text-11px;
}
</style>
