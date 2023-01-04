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
      <Select :options="['published', 'unpublished']" size="sm" v-model="filterData.status" label="status"
        >Status</Select
      >
      <Select :options="['John Doe', 'Jane Doe']" size="sm" v-model="filterData.customer" label="customer"
        >Customer</Select
      >
      <div>
        <div class="grid grid-cols-2 gap-x-4 items-center">
          <TextField size="sm" type="number" v-model="filterData.priceMin" label="min price" />
          <TextField size="sm" type="number" v-model="filterData.priceMax" label="max price" />
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
  priceMin: undefined,
  priceMax: undefined,
})

onClickOutside(menuRef, () => {
  isOpen = false
})
</script>
