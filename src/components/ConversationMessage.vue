<template>
  <li :class="[_class, 'p4 py-3 max-w-60% rounded-xl w-max flex flex-col']">
    <slot></slot>
    <span class="typo-sm self-end">{{ useDateFormat(time, 'h:mm a').value }}</span>
  </li>
</template>

<script setup lang="ts">
const { isFromMe = true } = defineProps<{
  time: string
  isFromMe?: boolean
}>()

let _class = isFromMe
  ? 'rounded-br-0! self-end fill-primary-3 typo-clr-on-primary bg-opacity-80'
  : 'bg-accent-3 dark:bg-white  rounded-bl-0! text-dark  self-start'
</script>
