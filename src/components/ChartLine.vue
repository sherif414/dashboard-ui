<script setup lang="ts">
import { Chart, registerables } from 'chart.js'

//register the used functions
Chart.register(...registerables)

let graident: CanvasGradient

let chart: Chart
// view the chart
onMounted(() => {
  const ctx = (document.getElementById('line-chart') as HTMLCanvasElement).getContext('2d')!
  graident = ctx.createLinearGradient(0, 0, 0, ctx.canvas.width)

  graident.addColorStop(0, 'rgba(124, 58, 237, 1)')
  graident.addColorStop(1, 'rgba(124, 58, 237, 0)')
  chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['sat', 'sun', 'mon', 'tus'],
      datasets: [
        {
          label: 'number of orders',
          data: [10, 25, 15, 35],
          cubicInterpolationMode: 'monotone',
          backgroundColor: [graident, graident, graident, graident],
          borderColor: 'violet',
          borderWidth: 2,
          fill: true,
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        x: {
          grid: {
            display: false,
          },
        },
        y: {
          grid: {
            display: false,
          },
          beginAtZero: true,
        },
      },
    },
  })
})

onUnmounted(() => {
  chart.destroy()
})
</script>

<template>
  <div class="surface-1 rounded-3 p2 grid place-content-center">
    <canvas id="line-chart"></canvas>
  </div>
</template>
