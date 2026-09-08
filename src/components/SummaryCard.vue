<template>
  <article
    :class="[
      fill === 'normal'
        ? 'surface-1 typo-clr-base border border-gray-2 dark:border-dark-3 shadow-sm'
        : 'fill-primary-2 typo-clr-on-primary border border-transparent shadow-md',
      'rounded-md p-4 sm:p-5 flex flex-col justify-between gap-y-4 transition hover:border-gray-3 dark:hover:border-dark-2',
    ]"
  >
    <div class="flex justify-between items-center">
      <div class="flex items-center gap-2">
        <slot name="icon" />
      </div>
      <span
        v-if="subtitle"
        class="typo-sm font-medium px-2 py-0.5 rounded surface-2 border border-gray-2 dark:border-dark-3 typo-clr-muted"
      >
        {{ subtitle }}
      </span>
      <button
        type="button"
        @click="showFilter = !showFilter"
        v-else-if="filter"
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
          <li @click="selectFilter('day')" class="hover:(fill-primary-2 typo-clr-on-primary) px-2 py-1 rounded cursor-pointer">this day</li>
          <li @click="selectFilter('week')" class="hover:(fill-primary-2 typo-clr-on-primary) px-2 py-1 rounded cursor-pointer">this week</li>
          <li @click="selectFilter('month')" class="hover:(fill-primary-2 typo-clr-on-primary) px-2 py-1 rounded cursor-pointer">this month</li>
        </ul>
      </button>
    </div>

    <div class="grid grid-cols-2 sm:grid-cols-2 gap-3 pt-1 text-left">
      <div v-for="{ name, value, growth } in data" :key="name" class="flex flex-col gap-0.5 min-w-0">
        <p class="typo-sm font-medium typo-clr-muted truncate uppercase tracking-wider text-11px">
          {{ name }}
        </p>
        <div class="flex items-baseline gap-1.5 flex-wrap">
          <p class="text-1.35rem sm:text-1.5rem font-bold font-mono tracking-tight typo-clr-base leading-tight">
            {{ !!value || value === 0 ? value : '-' }}
          </p>
          <span
            v-if="growth"
            class="typo-sm font-medium inline-flex items-center text-11px"
            :class="String(growth).startsWith('-') ? 'text-error dark:text-rose-400' : 'text-success dark:text-emerald-400'"
          >
            {{ growth }}
          </span>
        </div>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { onClickOutside } from '@vueuse/core'
import { ICaretDown } from '~/components/icons'

interface MetricItem {
  name: string
  value?: string | number | null
  growth?: string | number
}

interface Props {
  data: MetricItem[]
  fill?: 'primary' | 'normal'
  filter?: boolean
  subtitle?: string
}

const { filter = false, fill = 'normal', subtitle = '' } = defineProps<Props>()
const emit = defineEmits<{
  (e: 'filter-change', period: 'day' | 'week' | 'month'): void
}>()

const filterBy = ref<'day' | 'week' | 'month'>('week')
const showFilter = ref(false)
const filterEl = ref<HTMLElement | null>(null)

function selectFilter(period: 'day' | 'week' | 'month') {
  filterBy.value = period
  showFilter.value = false
  emit('filter-change', period)
}

onClickOutside(filterEl, () => {
  showFilter.value = false
})
</script>
