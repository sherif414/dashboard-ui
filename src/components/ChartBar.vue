<script setup lang="ts">
import { Chart, ChartConfiguration, registerables } from 'chart.js'

//register the used functions
Chart.register(...registerables)
//data and configs
const config = $computed<ChartConfiguration>(() => ({
  type: 'bar',
  data: {
    labels: ['sat', 'sun', 'mon', 'tus', 'wed', 'thu'],
    datasets: [
      {
        label: 'number of orders',
        data: [10, 30, 90, 30, 120, 130],
        barThickness: 16,
        cubicInterpolationMode: 'monotone',
        borderRadius: 999,
        backgroundColor: 'rgba(124, 58, 237)',
      },
    ],
  },
  options: {
    responsive: true,
    scales: {
      x: {
        stacked: true,
        grid: {
          display: false,
        },
      },

      y: {
        stacked: true,
        grid: {
          display: false,
        },
      },
    },
  },
}))

let chart: Chart
let ctx: HTMLCanvasElement
// view the chart

onMounted(() => {
  ctx = document.getElementById('bar-chart')! as HTMLCanvasElement
  chart = new Chart(ctx, config)
})
onUnmounted(() => {
  chart.destroy()
})
</script>

<template>
  <div class="surface-1 rounded-3 p2 grid place-content-center">
    <canvas id="bar-chart"></canvas>
  </div>
</template>
