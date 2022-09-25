<template>
  <span
    class="px2 py-2px rounded-full typo-sm bg-opacity-12"
    :class="{ 'bg-success text-success': variant === 'completed', 'bg-warn text-warn': variant === 'pending' }"
  >
    {{ variant }}
  </span>
</template>

<script setup lang="ts">
defineProps<{
  variant: 'completed' | 'pending'
}>()
</script>
