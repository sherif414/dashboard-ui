<template>
  <div class="relative">
    <div
      @click="isOpen = !isOpen"
      class="border dark:border-none border-gray-3 p-2 pr-3 rounded-md flex items-center gap-x-2 cursor-pointer select-none"
      :class="{ 'dark:bg-dark-6 border-indigo-6': isOpen }"
    >
      <IFilter width="14" height="14" /> filter
    </div>
    <div
      ref="menuRef"
      v-if="isOpen"
      class="grid items-start text-left gap-y-4 p4 absolute z-11 bg-white dark:bg-dark-300 rounded-md w-16rem mt2 border dark:border-none border-gray-2"
    >
      <h2 class="typo-head">Filter</h2>
      <h3 class="">Order Type</h3>

      <div class="flex items-center justify-between">
        <div class="flex items-center gap-x-2">
          <input id="filter-menu-home-delivery" type="checkbox" />
          <label for="filter-menu-home-delivery">Home delivery</label>
        </div>
        <div class="flex items-center gap-x-2">
          <input id="filter-menu-pickup" type="checkbox" />
          <label for="filter-menu-pickup">Pick Up</label>
        </div>
      </div>
      <div class="grid gap-y-1">
        <label for="filter-menu-status">Status</label>
        <Select :options="['published', 'unpublished']" size="sm" v-model="filterData.status">status</Select>
      </div>
      <div class="grid gap-y-1">
        <label for="customer-select">Customer</label>
        <Select :options="['John Doe', 'Jane Doe']" size="sm" v-model="filterData.customer"> customer </Select>
      </div>
      <div>
        <h3 class="mb-2">Amount</h3>
        <div class="grid grid-cols-2 gap-x-4 items-center">
          <div>
            <label for="filter-menu-from">from</label>
            <input
              placeholder="0"
              class="px2 py1 rounded focus:outline-none w-full dark:bg-dark-1 bg-gray-2"
              type="number"
              id="filter-menu-from"
            />
          </div>
          <div>
            <label for="filter-menu-to">to</label>
            <input
              placeholder="0"
              class="px2 py1 rounded focus:outline-none w-full dark:bg-dark-1 bg-gray-2"
              type="number"
              id="filter-menu-to"
            />
          </div>
        </div>
      </div>
      <button class="px2 py-6px rounded-md fill-primary-2 typo-clr-on-primary">Filter</button>
    </div>
  </div>
</template>

<script setup lang="ts">
let menuRef = ref<HTMLElement>()
let isOpen = $ref(false)

let filterData = $ref({
  customer: '',
  status: '',
})

onClickOutside(menuRef, () => {
  isOpen = false
})
</script>
