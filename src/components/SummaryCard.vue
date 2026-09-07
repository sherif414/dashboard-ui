<template>
  <article
    :class="[
      fill === 'normal' ? 'surface-1 typo-base border border-gray-2 dark:border-dark-3' : 'fill-primary-2 typo-clr-on-primary border border-transparent',
      'rounded-md typo-sm p4 flex flex-col justify-between gap-y-4 2xl:gap-y-8',
    ]"
  >
    <div class="flex justify-between items-center">
      <div class="flex gap-2">
        <slot name="icon" />
      </div>
      <button
        type="button"
        @click="showFilter = !showFilter"
        v-if="filter"
        aria-haspopup="true"
        :aria-expanded="showFilter"
        class="relative typo-sm typo-clr-muted hover:typo-clr-base transition focus:outline-none focus-visible:(ring-2 ring-indigo-5 dark:ring-violet-5 rounded)"
      >
        this {{ filterBy }}
        <ICaretDown class="ml-1 inline" width="12" height="12" />
        <ul
          ref="filterEl"
          v-if="showFilter"
          class="absolute p-1 rounded-md flex flex-col typo-sm surface-1 shadow-md w-max typo-clr-base right-0 top-100% z-20 text-left border border-gray-2 dark:border-dark-3"
        >
          <li @click="filterBy = 'day'" class="hover:(fill-primary-2 typo-clr-on-primary) px-2 py-1 rounded cursor-pointer">this day</li>
          <li @click="filterBy = 'week'" class="hover:(fill-primary-2 typo-clr-on-primary) px-2 py-1 rounded cursor-pointer">this week</li>
          <li @click="filterBy = 'month'" class="hover:(fill-primary-2 typo-clr-on-primary) px-2 py-1 rounded cursor-pointer">this month</li>
        </ul>
      </button>
    </div>
    <div class="flex justify-between text-left">
      <div v-for="{ name, value, growth } in data" :key="name">
        <h2 class="capitalize">{{ name }}</h2>
        <h3 class="typo-base">
          {{ !!value ? value : '-' }}
          <span v-if="growth" class="text-success typo-sm">{{ growth }}</span>
        </h3>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { onClickOutside } from '@vueuse/core'
import { ICaretDown } from '~/components/icons'

interface Props {
  data: { name: string; value?: string | number | null; growth?: string | number }[]
  fill?: 'primary' | 'normal'
  filter?: boolean
}

const { filter = true, fill = 'normal' } = defineProps<Props>()

const filterBy = ref<'day' | 'week' | 'month'>('week')
const showFilter = ref(false)
const filterEl = ref<HTMLElement | null>(null)

onClickOutside(filterEl, () => {
  showFilter.value = false
})
</script>
