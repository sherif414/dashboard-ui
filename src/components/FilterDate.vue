<template>
  <div class="relative">
    <button
      @click="isOpen = !isOpen"
      class="border dark:border-line border-gray-3 px2 py1 text-3 rounded flex items-center gap-x-2"
      :class="{ 'border-indigo-6 dark:border-violet-6': isOpen }"
    >
      <ICalender width="14" height="14" class="[&_path]:dark:stroke-gray-1" /> filter
    </button>
    <menu
      ref="menuRef"
      v-if="isOpen"
      class="w-15rem grid grid-cols-2 text-3 absolute bg-white shadow dark:shadow-none shadow-indigo-2 dark:bg-dark-300 shadow gap-4 left-[-100%] rounded-3 mt-2 p4"
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
      <button class="px2 py-6px rounded-2 bg-primary-90 hover:bg-primary-70 active:bg-primary-50 text-white col-span-2">
        Filter
      </button>
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
  color: #8b8d97;
  font-weight: 400;
}
input[type='checkbox']:checked + label {
  color: #53545c;
  font-weight: 900;
}
</style>
