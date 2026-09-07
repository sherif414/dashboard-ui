<template>
  <div
    role="switch"
    :aria-checked="modelValue"
    tabindex="0"
    @click="$emit('update:modelValue', !modelValue)"
    @keydown.space.prevent="$emit('update:modelValue', !modelValue)"
    @keydown.enter.prevent="$emit('update:modelValue', !modelValue)"
    :style="{ transform: scale ? `scale(${scale})` : undefined }"
    class="w-42px h-24px rounded-full relative select-none transition duration-300 cursor-pointer inline-block focus:outline-none focus-visible:(ring-2 ring-offset-2 ring-indigo-5 dark:ring-violet-5)"
    :class="{ 'fill-primary-3': modelValue, 'bg-gray-3 dark:bg-dark-1': !modelValue }"
  >
    <span
      :class="{
        'fill-primary-2 translate-x-20px border-indigo-6 dark:border-violet-6': modelValue,
        'surface-1 border-white dark:border-dark-9 translate-x-3px': !modelValue,
      }"
      class="h-18px absolute w-18px left-0 top-0 rounded-full transition-all select-none duration-300 border-2px translate-y-3px shadow"
    ></span>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    modelValue?: boolean
    scale?: number
  }>(),
  {
    modelValue: false,
  }
)

defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()
</script>
