<template>
  <div class="relative">
    <button
      type="button"
      :aria-expanded="isOpen"
      aria-haspopup="dialog"
      @click="isOpen = !isOpen"
      class="border border-gray-2 dark:border-dark-3 p-2 pr-3 rounded-md flex items-center gap-x-2 cursor-pointer select-none typo-clr-muted hover:typo-clr-base transition-colors"
      :class="{ 'border-indigo-6! dark:border-violet-5! surface-2': isOpen }"
    >
      <ICalender width="14" height="14" /> Date Filter
    </button>
    <div
      ref="menuRef"
      v-show="isOpen"
      class="w-15rem grid grid-cols-2 absolute z-2 surface-1 gap-4 right-[-4rem] rounded-md mt-2 p4 border border-gray-2 dark:border-dark-3 shadow-lg typo-clr-base"
    >
      <h3 class="col-span-2 text-left font-medium text-sm typo-clr-base">By Date</h3>
      <div class="flex items-center gap-x-2">
        <input id="this-week-cb" type="checkbox" class="accent-indigo-6 dark:accent-violet-5" />
        <label for="this-week-cb" class="text-xs cursor-pointer typo-clr-base">This week</label>
      </div>
      <div class="flex items-center gap-x-2">
        <input id="last-week-cb" type="checkbox" class="accent-indigo-6 dark:accent-violet-5" />
        <label for="last-week-cb" class="text-xs cursor-pointer typo-clr-base">Last week</label>
      </div>
      <div class="flex items-center gap-x-2">
        <input id="this-month-cb" type="checkbox" class="accent-indigo-6 dark:accent-violet-5" />
        <label for="this-month-cb" class="text-xs cursor-pointer typo-clr-base">This month</label>
      </div>
      <div class="flex items-center gap-x-2">
        <input id="last-month-cb" type="checkbox" class="accent-indigo-6 dark:accent-violet-5" />
        <label for="last-month-cb" class="text-xs cursor-pointer typo-clr-base">Last month</label>
      </div>
      <div class="flex items-center gap-x-2">
        <input id="this-year-cb" type="checkbox" class="accent-indigo-6 dark:accent-violet-5" />
        <label for="this-year-cb" class="text-xs cursor-pointer typo-clr-base">This year</label>
      </div>
      <div class="flex items-center gap-x-2">
        <input id="last-year-cb" type="checkbox" class="accent-indigo-6 dark:accent-violet-5" />
        <label for="last-year-cb" class="text-xs cursor-pointer typo-clr-base">Last year</label>
      </div>
      <button class="px2 py-6px rounded-md fill-primary-2 typo-clr-on-primary col-span-2 cursor-pointer text-xs font-medium hover:fill-primary-3 transition-colors">Apply Filter</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { onClickOutside } from '@vueuse/core'
import { ICalender } from '~/components/icons'

const isOpen = ref(false)
const menuRef = ref<HTMLElement>()
onClickOutside(menuRef, () => {
  isOpen.value = false
})
</script>

<style scoped>
input[type='checkbox'] + label {
  font-weight: 400;
}
input[type='checkbox']:checked + label {
  font-weight: bold;
}
</style>
