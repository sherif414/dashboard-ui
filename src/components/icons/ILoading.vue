<template>
  <div class="spinner">
    <div></div>
    <div></div>
    <div></div>
  </div>
</template>

<script setup lang="ts">
import { animate } from 'motion'
import { onMounted } from 'vue'

onMounted(() => {
  animate(
    '.spinner > div:nth-child(1)',
    { rotate: 360 },
    { duration: 1, repeat: Infinity, easing: 'linear', direction: 'reverse' }
  )
  animate('.spinner > div:nth-child(2)', { rotate: 360 }, { duration: 1, repeat: Infinity, easing: 'ease' })
  animate('.spinner > div:nth-child(3)', { rotate: 360 }, { duration: 1, repeat: Infinity, easing: 'linear' })
})
</script>

<style>
.spinner {
  position: absolute;
  display: grid;
  place-self: center;
  place-items: center;
}

.spinner > div {
  position: absolute;
  border-radius: 50%;
  border: 3px solid transparent;
  border-top-color: currentColor;
}
.spinner > div:nth-child(1) {
  border-left-color: currentColor;
  width: 100%;
  height: 100%;
}
.spinner > div:nth-child(2) {
  width: 70%;
  height: 70%;
  border-style: dotted;
}
.spinner > div:nth-child(3) {
  border-left-color: currentColor;
  width: 50%;
  height: 50%;
}
</style>
