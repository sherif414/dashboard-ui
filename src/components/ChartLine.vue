<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { Chart, registerables } from 'chart.js'

//register the used functions
Chart.register(...registerables)

let graident: CanvasGradient

let chart: Chart
// view the chart
onMounted(() => {
  const ctx = (document.getElementById('line-chart') as HTMLCanvasElement).getContext('2d')!
  graident = ctx.createLinearGradient(0, 0, 0, ctx.canvas.width)

  const isDarkMode = document.documentElement.classList.contains('dark')
  const primaryColor = isDarkMode ? 'rgb(124, 58, 237)' : 'rgb(79, 70, 229)'

  graident.addColorStop(0, isDarkMode ? 'rgba(124, 58, 237, 0.4)' : 'rgba(79, 70, 229, 0.35)')
  graident.addColorStop(1, isDarkMode ? 'rgba(124, 58, 237, 0)' : 'rgba(79, 70, 229, 0)')
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
          borderColor: primaryColor,
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
