<template>
  <button
    class="p-2 flex items-center gap-x-2 border dark:border-none border-gray-3 rounded-md"
    :class="{ 'dark:bg-dark-6 border-indigo-6': isOpen }"
    @click="isOpen = !isOpen"
  >
    Bulk Action <ICaretDown width="14" height="14" />
  </button>
</template>

<script setup lang="ts">
let isOpen = $ref(false)
</script>
