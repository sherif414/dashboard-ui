<template>
  <span
    class="px2 py-2px rounded-full typo-sm bg-opacity-12"
    :class="{ 'bg-success text-success': status, 'bg-warn text-warn': !status }"
  >
    <slot></slot>
  </span>
</template>

<script setup lang="ts">
defineProps<{
  status: boolean | null
}>()
</script>
