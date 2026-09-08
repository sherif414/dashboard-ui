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
      ? 'bg-success/15 text-success dark:text-emerald-400'
      : 'bg-warn/15 text-warn dark:text-amber-400'
  }

  const s = String(props.status ?? '').toLowerCase()
  if (s === 'completed' || s === 'active' || s === 'published') {
    return 'bg-success/15 text-success dark:text-emerald-400'
  }
  if (s === 'cancelled' || s === 'canceled' || s === 'damaged' || s === 'inactive') {
    return 'bg-error/15 text-error dark:text-rose-400'
  }
  // Default pending / in-progress / other
  return 'bg-warn/15 text-warn dark:text-amber-400'
})
</script>
