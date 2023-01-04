<template>
  <td class="p2 px-4 hover:bg-gray-1 dark:hover:bg-dark-4 cursor-pointer" @click="emits('sort', column)">
    <div class="flex items-center justify-between">
      <slot></slot>
      <ISort
        :class="{
          'rotate-180 ': orderBy === column && !sortAscending,
          'opacity-100!': orderBy === column,
        }"
        class="ml2 transition-transform rotate-0 opacity-0"
      />
    </div>
  </td>
</template>

<script setup lang="ts">
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
