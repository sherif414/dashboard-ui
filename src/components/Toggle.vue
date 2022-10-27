<template>
  <div
    @click="$emit('update:modelValue', !modelValue)"
    :style="{ scale: scale }"
    class="w-42px h-24px rounded-full relative select-none transition duration-300 cursor-pointer scale-80"
    :class="{ 'fill-primary-3': modelValue, 'bg-gray-2 dark:bg-dark-1': !modelValue }"
  >
    <input v-show="false" type="checkbox" :value="modelValue" />
    <span
      :class="{
        'fill-primary-2 translate-x-21px  border-indigo-6 dark:border-violet-6 ': modelValue,
        'surface-1 border-white dark:border-dark-9 translate-x-3px': !modelValue,
      }"
      class="h-18px absolute w-18px left-0 top-0 rounded-full transition-all select-none duration-300 border-2px translate-y-3px shadow"
    ></span>
  </div>
</template>

<script setup lang="ts">
const { modelValue = false } = defineProps<{
  modelValue: boolean
  scale?: number
}>()
</script>
