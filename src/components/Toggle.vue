<template>
  <div
    role="switch"
    :aria-checked="modelValue"
    :aria-label="ariaLabel || ($attrs['aria-label'] as string)"
    tabindex="0"
    @click="$emit('update:modelValue', !modelValue)"
    @keydown.space.prevent="$emit('update:modelValue', !modelValue)"
    @keydown.enter.prevent="$emit('update:modelValue', !modelValue)"
    :style="{ transform: scale ? `scale(${scale})` : undefined }"
    class="w-42px h-24px rounded-full relative select-none cursor-pointer inline-block transition-all duration-240 ease-[cubic-bezier(0.16,1,0.3,1)] active:scale-95 focus:outline-none focus-visible:(ring-2 ring-offset-2 ring-indigo-5 dark:ring-violet-5)"
    :class="modelValue ? 'fill-primary-2' : 'bg-gray-3 dark:bg-dark-3'"
  >
    <span
      :class="modelValue ? 'translate-x-20px' : 'translate-x-3px'"
      class="h-18px absolute w-18px left-0 top-0 rounded-full transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] select-none bg-white shadow-md translate-y-3px"
    ></span>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    modelValue?: boolean
    scale?: number
    ariaLabel?: string
  }>(),
  {
    modelValue: false,
  }
)

defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()
</script>
