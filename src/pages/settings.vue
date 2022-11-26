<script setup lang="ts">
let value = $ref([])
const options = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine']
</script>

<template>
  <main class="h-screen flex flex-col gap-4 justify-center place-items-center">
    {{ value }}
    <Select :options="options" v-model="value">select a number</Select>
  </main>
</template>

<style scoped></style>
