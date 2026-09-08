<template>
  <span
    class="px2 py-2px rounded-full typo-sm font-medium inline-flex items-center gap-1"
    :class="chipClass"
  >
    <slot></slot>
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  status?: boolean | string | null
}>()

const chipClass = computed(() => {
  if (typeof props.status === 'boolean') {
    return props.status
      ? 'bg-emerald-100/70 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300 border border-emerald-300/40 dark:border-emerald-500/20'
      : 'bg-amber-100/70 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300 border border-amber-300/40 dark:border-amber-500/20'
  }

  const s = String(props.status ?? '').toLowerCase()
  if (s === 'completed' || s === 'active' || s === 'published') {
    return 'bg-emerald-100/70 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300 border border-emerald-300/40 dark:border-emerald-500/20'
  }
  if (s === 'cancelled' || s === 'canceled' || s === 'damaged' || s === 'inactive') {
    return 'bg-rose-100/70 text-rose-800 dark:bg-rose-500/15 dark:text-rose-300 border border-rose-300/40 dark:border-rose-500/20'
  }
  // Default pending / in-progress / other
  return 'bg-amber-100/70 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300 border border-amber-300/40 dark:border-amber-500/20'
})
</script>
