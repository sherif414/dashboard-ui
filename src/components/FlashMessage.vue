<template>
  <Transition
    enter-from-class="translate-x-100%"
    enter-active-class="transition-all duration-300 ease-out"
    leave-to-class="translate-x-150%"
    leave-active-class="transition-all duration-300 ease-out"
  >
    <div
      v-if="show"
      :class="[variant === 'error' ? 'bg-error' : 'bg-success']"
      class="rounded-md p-4 fixed mx-auto max-w-30ch z-999 right-12 bottom-12 shadow-md typo-clr-on-primary"
    >
      {{ msg }}
    </div>
  </Transition>
</template>

<script setup lang="ts">
defineProps<{
  msg: string
  show: boolean
  variant: 'success' | 'error'
}>()
</script>
