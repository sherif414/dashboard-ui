<template>
  <li
    :class="[
      bubbleClass,
      'px-4 py-2.5 max-w-85% sm:max-w-75% md:max-w-65% w-max flex flex-col transition-all duration-200 break-words',
    ]"
  >
    <span class="sr-only">{{ isFromMe ? 'You: ' : 'Contact: ' }}</span>
    <span class="leading-relaxed"><slot></slot></span>
    <span
      class="text-11px self-end mt-1 tabular-nums font-mono select-none"
      :class="isFromMe ? 'text-white/75' : 'typo-clr-muted'"
    >
      {{ formattedTime }}
    </span>
  </li>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    time: string
    isFromMe?: boolean
  }>(),
  {
    isFromMe: true,
  }
)

const bubbleClass = computed(() =>
  props.isFromMe
    ? 'fill-primary-2 typo-clr-on-primary rounded-2xl rounded-br-xs self-end shadow-xs'
    : 'surface-2 border border-gray-2 dark:border-dark-3 typo-clr-base rounded-2xl rounded-bl-xs self-start shadow-xs'
)

const formattedTime = computed(() => {
  if (!props.time) return ''
  try {
    const d = new Date(props.time)
    return isNaN(d.getTime()) ? props.time : d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
  } catch {
    return props.time
  }
})
</script>
