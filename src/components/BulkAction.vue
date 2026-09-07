<template>
  <button
    type="button"
    :aria-expanded="isOpen"
    class="p-2 flex items-center gap-x-2 border border-gray-2 dark:border-dark-3 rounded-md cursor-pointer text-typo-muted hover:text-typo transition-colors"
    :class="{ 'dark:bg-dark-6 border-indigo-6! dark:border-indigo-5!': isOpen }"
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
