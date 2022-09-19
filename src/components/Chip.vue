<template>
  <span
    class="px2 py-2px rounded-full text-3"
    :class="{ 'bg-success': variant === 'completed', 'bg-error': variant === 'pending' }"
  >
    {{ variant }}
  </span>
</template>

<script setup lang="ts">
defineProps<{
  variant: 'completed' | 'pending'
}>()
</script>
