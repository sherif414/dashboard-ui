<template>
  <div class="relative">
    <button
      @click="isOpen = !isOpen"
      class="border dark:border-line border-gray-3 px2 py1 text-3 rounded flex items-center gap-x-2"
      :class="{ 'dark:border-violet-6 border-indigo-6': isOpen }"
    >
      <IFilter width="14" height="14" class="[&_path]:dark:stroke-gray-1" /> filter
    </button>
    <menu
      ref="menuRef"
      v-if="isOpen"
      class="grid items-start text-left gap-y-4 p4 text-3 absolute z-11 bg-white shadow-md shadow-indigo-2 dark:shadow-none dark:bg-dark-300 rounded-3 font-light w-16rem mt2 shadow"
    >
      <h2 class="text-0.875rem font-semibold">Filter</h2>
      <h3 class="font-semibold">Order Type</h3>
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-x-2">
          <input id="home-delivary-input" type="checkbox" />
          <label for="home-delivary-input">Home Delivary</label>
        </div>
        <div class="flex items-center gap-x-2">
          <input id="pickup-input" type="checkbox" />
          <label for="pickup-input">Pick Up</label>
        </div>
      </div>
      <div class="grid gap-y-2">
        <label class="font-semibold" for="status-select">Status</label>
        <select class="border border-line focus:outline-none rounded-1 px2 py1 dark:bg-dark-300" id="status-select">
          <option value="completed">completed</option>
          <option value="in progress">in progress</option>
        </select>
      </div>
      <div class="grid gap-y-2">
        <label class="font-semibold" for="customer-select">Customer</label>
        <select class="border border-line focus:outline-none rounded-1 px2 py1 dark:bg-dark-300" id="customer-select">
          <option value="all">All</option>
          <option value="sherif hassan">sherif hassan</option>
        </select>
      </div>
      <div>
        <h3 class="mb-2 font-semibold">Amount</h3>
        <div class="grid grid-cols-2 gap-x-4 items-center">
          <div>
            <label for="filter-menu-from">from</label>
            <input
              class="px2 py1 rounded focus:outline-none border border-line w-full dark:bg-dark-300"
              type="number"
              name=""
              id="filter-menu-from"
            />
          </div>
          <div>
            <label for="filter-menu-to">to</label>
            <input
              class="px2 py1 rounded focus:outline-none border border-line w-full dark:bg-dark-300"
              type="number"
              name=""
              id="filter-menu-to"
            />
          </div>
        </div>
      </div>
      <button class="px2 py-6px rounded-2 bg-primary-90 hover:bg-primary-70 active:bg-primary-50 text-white">
        Filter
      </button>
    </menu>
  </div>
</template>

<script setup lang="ts">
let menuRef = ref<HTMLElement>()
let isOpen = $ref(false)

onClickOutside(menuRef, () => {
  isOpen = false
})
</script>
