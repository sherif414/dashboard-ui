<template>
  <nav
    class="inline-flex items-center gap-1 font-mono text-xs select-none typo-clr-base"
    :class="{ 'rounded-full': round }"
    aria-label="Pagination"
  >
    <!-- Prev Button -->
    <button
      type="button"
      @click="changePage('prev', 1)"
      :disabled="pageNum <= 1"
      class="inline-flex items-center justify-center h-7 min-w-7 px-1.5 rounded surface-2 border border-gray-2 dark:border-dark-3 hover:surface-3 typo-clr-base disabled:(opacity-30 pointer-events-none) transition-colors cursor-pointer"
      aria-label="Previous page"
    >
      <ICaretDown width="14" height="14" class="rotate-90" />
    </button>

    <!-- First Page -->
    <button
      v-if="pageNum - 1 > pageShowSize && maxLen > pageShowSize * 2 + 7"
      type="button"
      @click="changePage(false, 1)"
      class="inline-flex items-center justify-center h-7 min-w-7 px-2 rounded surface-2 border border-gray-2 dark:border-dark-3 hover:surface-3 typo-clr-base transition-colors cursor-pointer"
    >
      1
    </button>

    <span
      v-if="pageNum - 1 > pageShowSize && maxLen > pageShowSize * 2 + 7 && pageInterval[0] !== 2"
      class="inline-flex items-center justify-center h-7 px-1 typo-clr-muted"
    >
      …
    </span>

    <!-- Numbered Pages -->
    <button
      v-for="item in pageInterval"
      :key="item"
      type="button"
      @click="changePage(false, item)"
      :class="[
        item === pageNum
          ? 'fill-primary-2 typo-clr-on-primary font-bold shadow-xs border-transparent'
          : 'surface-2 border border-gray-2 dark:border-dark-3 hover:surface-3 typo-clr-base'
      ]"
      class="inline-flex items-center justify-center h-7 min-w-7 px-2 rounded transition-colors cursor-pointer border"
    >
      {{ item }}
    </button>

    <span
      v-if="
        pageNum < maxLen - pageShowSize &&
        maxLen > pageShowSize * 2 + 7 &&
        pageInterval[pageInterval.length - 1] + 1 !== maxLen
      "
      class="inline-flex items-center justify-center h-7 px-1 typo-clr-muted"
    >
      …
    </span>

    <!-- Last Page -->
    <button
      v-if="pageNum < maxLen - pageShowSize && maxLen > pageShowSize * 2 + 7"
      type="button"
      @click="changePage(false, maxLen)"
      class="inline-flex items-center justify-center h-7 min-w-7 px-2 rounded surface-2 border border-gray-2 dark:border-dark-3 hover:surface-3 typo-clr-base transition-colors cursor-pointer"
    >
      {{ maxLen }}
    </button>

    <!-- Next Button -->
    <button
      type="button"
      @click="changePage('next', 1)"
      :disabled="pageNum >= maxLen"
      class="inline-flex items-center justify-center h-7 min-w-7 px-1.5 rounded surface-2 border border-gray-2 dark:border-dark-3 hover:surface-3 typo-clr-base disabled:(opacity-30 pointer-events-none) transition-colors cursor-pointer"
      aria-label="Next page"
    >
      <ICaretDown width="14" height="14" class="rotate-270" />
    </button>
  </nav>
</template>

<script lang="ts" setup>
import { ref, watch, computed } from 'vue'
import { ICaretDown } from '~/components/icons'

const props = withDefaults(
  defineProps<{
    total?: number
    pageNum?: number
    pageSize?: number
    pageShowSize?: number
    round?: boolean
  }>(),
  {
    total: 100,
    pageNum: 1,
    pageSize: 20,
    pageShowSize: 2,
    round: false,
  }
)

const emit = defineEmits<{
  (e: 'update:pageNum', val: number): void
  (e: 'update:pageSize', val: number): void
  (e: 'change', payload: { pageNum: number; pageSize: number; total: number; pageShowSize: number }): void
}>()

const generateArray = (start: number, end: number) => {
  return Array.from(new Array(end + 1).keys()).slice(start)
}

const pageNum = ref(props.pageNum)
const pageSize = ref(props.pageSize)

watch(
  () => props.pageNum,
  (v) => {
    changePage(false, v)
    emit('change', {
      pageNum: pageNum.value,
      pageSize: pageSize.value,
      total: props.total,
      pageShowSize: props.pageShowSize,
    })
  }
)

watch(
  () => props.pageSize,
  (v) => {
    pageSize.value = v
  }
)

const maxLen = computed(() => {
  return Math.max(1, Math.ceil(props.total / pageSize.value))
})

const pageInterval = computed(() => {
  let start = pageNum.value - props.pageShowSize
  let end = pageNum.value + props.pageShowSize

  if (pageNum.value <= props.pageShowSize) {
    start = 1
    end = props.pageShowSize * 2
  }

  if (pageNum.value >= maxLen.value - props.pageShowSize) {
    start = maxLen.value - props.pageShowSize * 2
    end = maxLen.value
  }

  if (start <= 0) {
    start = 1
  }

  if (maxLen.value <= props.pageShowSize * 2 + 7) {
    start = 1
    end = maxLen.value
  }

  if (end === 1 && props.total > pageSize.value) {
    end += 1
  }

  let pageArr = generateArray(start, end)

  if (pageArr.length < 1) {
    pageArr = [1]
  }

  return pageArr
})

const changePage = (type: 'next' | 'prev' | false, num: number) => {
  if (type === 'next') {
    pageNum.value += num
  } else if (type === 'prev') {
    pageNum.value -= num
  } else {
    pageNum.value = num
  }

  if (pageNum.value < 1) {
    pageNum.value = 1
  } else if (pageNum.value > maxLen.value) {
    pageNum.value = maxLen.value
  }

  emit('update:pageNum', pageNum.value)
  emit('update:pageSize', pageSize.value)
}
</script>
