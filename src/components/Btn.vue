<template>
  <button
    class="relative h-10 capitalize w-25ch max-w-full text-center rounded-md font-medium text-14px select-none grid place-items-center transition-all duration-150 ease-out focus:outline-none focus-visible:(outline-2 outline-offset-2 outline-indigo-5 dark:outline-violet-5)"
    :disabled="isDisabled"
    :type="type"
    :class="{
      'typo-clr-on-primary fill-primary-2 hover:fill-primary-3 active:fill-primary-1 active:scale-[0.98] cursor-pointer shadow-xs': variant === 'primary' && !isDisabled,
      'typo-clr-primary hover:surface-2 active:scale-[0.98] cursor-pointer': variant === 'text' && !isDisabled,
      'fill-primary-3 typo-clr-on-primary opacity-70 cursor-not-allowed': isDisabled && variant === 'primary',
      'typo-clr-disabled cursor-not-allowed opacity-60': isDisabled && variant === 'text',
    }"
  >
    <Transition name="btn-crossfade" mode="out-in">
      <span v-if="!loading" class="inline-flex items-center justify-center gap-1.5 w-full">
        <slot />
      </span>
      <div v-else class="loading" />
    </Transition>
  </button>
</template>
<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  type?: 'submit' | 'button' | 'reset'
  loading?: boolean
  disabled?: boolean
  variant?: 'text' | 'primary'
}
const { type = 'button', loading = false, disabled = false, variant = 'primary' } = defineProps<Props>()

const isDisabled = computed(() => disabled || loading)
</script>
