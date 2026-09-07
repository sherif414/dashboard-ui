<template>
  <button
    class="p-2 flex items-center gap-x-2 border dark:border-none border-gray-3 rounded-md cursor-pointer"
    :class="{ 'dark:bg-dark-6 border-indigo-6': isOpen }"
    @click="isOpen = !isOpen"
  >
    Bulk Action <ICaretDown width="14" height="14" />
  </button>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ICaretDown } from '~/components/icons'

const isOpen = ref(false)
</script>
