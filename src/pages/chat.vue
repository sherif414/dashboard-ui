<script setup lang="ts">
let value = $ref<boolean>()
</script>

<template>
  <main class="grid place-items-center h-80vh surface-1">
    <div class="w-20rem flex flex-col gap-4">
      value is: {{ value }}
      <Toggle v-model="value" />
    </div>
  </main>
</template>

<style scoped></style>
