<template>
  <button
    :disabled="isDisabled"
    :class="{ 'fill-primary-3 pointer-events-none': isDisabled }"
    :type="type"
    class="transition h-10 capitalize w-25ch text-center rounded-md typo-clr-on-primary hover:fill-primary-3 fill-primary-2 active:fill-primary-1 focus:outline-none grid place-items-center"
  >
    <slot v-if="!loading" />

    <div v-else class="h-6 w-6 rounded-50% border-white border-2 border-l-transparent animate-spin" />
  </button>
</template>
<script setup lang="ts">
const {
  type = 'button',
  loading = false,
  disabled = false,
} = defineProps<{
  type?: 'submit' | 'button' | 'reset'
  loading?: boolean
  disabled?: boolean
}>()

let isDisabled = $computed(() => disabled || loading)
</script>
