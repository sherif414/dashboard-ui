<template>
  <article
    :class="[
      fill === 'normal' ? 'surface-1 typo-base' : 'fill-primary-2 typo-clr-on-primary',
      'rounded-md typo-sm p4 flex flex-col justify-between gap-y-4 2xl:gap-y-8',
    ]"
  >
    <div class="flex justify-between">
      <div class="flex gap-2">
        <slot name="icon" />
      </div>
      <button type="button" @click="showFilter = !showFilter" v-if="filter" class="relative">
        this {{ filterBy }}
        <ICaretDown class="ml-1 inline" width="12" height="12" />
        <ul
          ref="filterEl"
          v-if="showFilter"
          class="absolute p-1 rounded-md flex flex-col typo-sm surface-1 shadow-md w-max typo-clr-base left-0 top-100% z-10 text-left"
        >
          <li @click="filterBy = 'day'" class="hover:(fill-primary-2 typo-clr-on-primary) px-2 py-1">this day</li>
          <li @click="filterBy = 'week'" class="hover:(fill-primary-2 typo-clr-on-primary) px-2 py-1">this week</li>
          <li @click="filterBy = 'month'" class="hover:(fill-primary-2 typo-clr-on-primary) px-2 py-1">this month</li>
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
interface Props {
  data: { name: string; value?: string | number | null; growth?: string | number }[]
  fill?: 'primary' | 'normal'
  filter?: boolean
}

const { filter = true, fill = 'normal' } = defineProps<Props>()

let filterBy = $ref<'day' | 'week' | 'month'>('week')
let showFilter = $ref(false)
const filterEl = ref<HTMLElement | null>(null)

onClickOutside(filterEl, () => {
  showFilter = false
})
</script>
