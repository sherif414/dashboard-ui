<template>
  <button
    type="button"
    :aria-expanded="isOpen"
    class="p-2 flex items-center gap-x-2 border border-gray-2 dark:border-dark-3 rounded-md cursor-pointer typo-clr-muted hover:typo-clr-base transition-colors"
    :class="{ 'surface-2 border-indigo-6! dark:border-violet-5!': isOpen }"
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
