<template>
  <button
    class="transition h-10 capitalize w-25ch text-center rounded-md focus:outline-none grid place-items-center"
    :disabled="isDisabled"
    :type="type"
    :class="{
      'typo-clr-on-primary fill-primary-2 hover:fill-primary-3 active:fill-primary-1': variant === 'primary',
      'hover:surface-2': variant === 'text' && !isDisabled,
      'fill-primary-3': isDisabled && variant === 'primary',
      'typo-clr-disabled cursor-not-allowed': isDisabled,
    }"
  >
    <slot v-if="!loading" />

    <div v-else class="loading" />
  </button>
</template>
<script setup lang="ts">
interface Props {
  type?: 'submit' | 'button' | 'reset'
  loading?: boolean
  disabled?: boolean
  variant?: 'text' | 'primary'
}
const { type = 'button', loading = false, disabled = false, variant = 'primary' } = defineProps<Props>()

let isDisabled = $computed(() => disabled || loading)
</script>
