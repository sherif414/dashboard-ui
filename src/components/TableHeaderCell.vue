<template>
  <td class="p2 px-4 hover:bg-gray-1 dark:hover:bg-dark-2 cursor-pointer select-none transition-colors duration-150 group" @click="emits('sort', column)">
    <div class="flex items-center justify-between gap-1">
      <slot></slot>
      <ISort
        :class="{
          'rotate-180 text-indigo-5 dark:text-violet-4 opacity-100!': orderBy === column && sortAscending,
          'rotate-0 text-indigo-5 dark:text-violet-4 opacity-100!': orderBy === column && !sortAscending,
          'opacity-0 group-hover:opacity-30': orderBy !== column,
        }"
        class="ml-2 transition-all duration-200 shrink-0"
      />
    </div>
  </td>
</template>

<script setup lang="ts">
import { ISort } from '~/components/icons'

interface Props {
  column: string
  orderBy: string
  sortAscending: boolean
}

defineProps<Props>()

const emits = defineEmits<{
  (event: 'sort', value: string): void
}>()
</script>
