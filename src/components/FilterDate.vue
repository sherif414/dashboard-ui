<template>
  <div class="relative">
    <button
      @click="isOpen = !isOpen"
      class="border dark:border-none border-gray-3 p-2 pr-3 rounded-md flex items-center gap-x-2"
      :class="{ 'border-indigo-6 dark:bg-dark-6': isOpen }"
    >
      <ICalender width="14" height="14" /> date filter
    </button>
    <menu
      ref="menuRef"
      v-show="isOpen"
      class="w-15rem grid grid-cols-2 absolute z-2 bg-white dark:bg-dark-300 gap-4 right-[-4rem] rounded-md mt-2 p4 border dark:border-none border-gray-2"
    >
      <h2 class="col-span-2 text-left">By Date</h2>
      <div class="flex items-center gap-x-2">
        <input id="this-week-cb" type="checkbox" />
        <label for="this-week-cb">this week</label>
      </div>
      <div class="flex items-center gap-x-2">
        <input id="last-week-cb" type="checkbox" />
        <label for="last-week-cb">last week</label>
      </div>
      <div class="flex items-center gap-x-2">
        <input id="this-month-cb" type="checkbox" />
        <label for="this-month-cb">this month</label>
      </div>
      <div class="flex items-center gap-x-2">
        <input id="last-month-cb" type="checkbox" />
        <label for="last-month-cb">last month</label>
      </div>
      <div class="flex items-center gap-x-2">
        <input id="this-year-cb" type="checkbox" />
        <label for="this-year-cb">this year</label>
      </div>
      <div class="flex items-center gap-x-2">
        <input id="last-year-cb" type="checkbox" />
        <label for="last-year-cb">last year</label>
      </div>
      <button class="px2 py-6px rounded-md fill-primary-2 typo-clr-on-primary col-span-2">Filter</button>
    </menu>
  </div>
</template>

<script setup lang="ts">
let isOpen = $ref(false)
let menuRef = ref<HTMLElement>()
onClickOutside(menuRef, () => {
  isOpen = false
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
