<template>
  <div class="relative">
    <button
      type="button"
      :aria-expanded="isOpen"
      aria-haspopup="dialog"
      @click="isOpen = !isOpen"
      class="border border-gray-2 dark:border-dark-3 p-2 pr-3 rounded-md flex items-center gap-x-2 cursor-pointer select-none text-typo-muted hover:text-typo transition-colors"
      :class="{ 'dark:bg-dark-6 border-indigo-6! dark:border-indigo-5!': isOpen }"
    >
      <IFilter width="14" height="14" /> Filter
    </button>
    <div
      ref="menuRef"
      v-if="isOpen"
      class="grid items-start text-left gap-y-4 p4 absolute z-11 surface-1 rounded-md w-16rem mt2 border border-gray-2 dark:border-dark-3 shadow-lg"
    >
      <h3 class="font-medium text-sm">Order Type</h3>

      <div class="flex items-center justify-between">
        <div class="flex items-center gap-x-2">
          <input id="filter-menu-home-delivery" type="checkbox" class="accent-indigo-6" />
          <label for="filter-menu-home-delivery" class="text-xs cursor-pointer">Home delivery</label>
        </div>
        <div class="flex items-center gap-x-2">
          <input id="filter-menu-pickup" type="checkbox" class="accent-indigo-6" />
          <label for="filter-menu-pickup" class="text-xs cursor-pointer">Pick Up</label>
        </div>
      </div>
      <Select :options="['published', 'unpublished']" size="sm" v-model="filterData.status"
        >Status</Select
      >
      <Select :options="['John Doe', 'Jane Doe']" size="sm" v-model="filterData.customer"
        >Customer</Select
      >
      <div>
        <div class="grid grid-cols-2 gap-x-4 items-center">
          <TextField size="sm" type="number" v-model="filterData.priceMin" label="min price" />
          <TextField size="sm" type="number" v-model="filterData.priceMax" label="max price" />
        </div>
      </div>
      <button class="px2 py-6px rounded-md fill-primary-2 typo-clr-on-primary cursor-pointer text-xs font-medium hover:opacity-90 transition-opacity">Apply Filter</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { onClickOutside } from '@vueuse/core'
import { IFilter } from '~/components/icons'
import Select from '~/components/Select.vue'
import TextField from '~/components/TextField.vue'

const menuRef = ref<HTMLElement>()
const isOpen = ref(false)

const filterData = ref({
  customer: '',
  status: '',
  priceMin: undefined,
  priceMax: undefined,
})

onClickOutside(menuRef, () => {
  isOpen.value = false
})
</script>
