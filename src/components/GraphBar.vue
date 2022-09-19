<script setup lang="ts">
import { Chart, ChartConfiguration, ChartTypeRegistry, registerables } from 'chart.js'
const props = defineProps<{
  chartId: string
  type: keyof ChartTypeRegistry
}>()

//register the used functions
Chart.register(...registerables)

//data and configs
const config: ChartConfiguration = {
  type: props.type,
  data: {
    labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
    datasets: [
      {
        label: 'number of orders',
        data: [1, 3, 9, 3, 12, 13],
        cubicInterpolationMode: 'monotone',
        borderRadius: Number.MAX_VALUE,
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
  },
  options: {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  },
}

let chart: Chart
// view the chart
onMounted(() => {
  const ctx = document.getElementById(props.chartId) as HTMLCanvasElement
  if (ctx) {
    chart = new Chart(ctx, config)
  }
})
onUnmounted(() => {
  chart.destroy()
})
</script>

<template>
  <div class="bg-dark-600 rounded-3 p2">
    <canvas :id="chartId" height="auto"></canvas>
  </div>
</template>
