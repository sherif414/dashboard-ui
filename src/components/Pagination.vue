<script lang="ts" setup>
import { PropType } from 'vue'

type Options = {
  label: number | string
  value: number | string
}

const props = defineProps({
  total: {
    type: Number,
    default: 100,
  },
  pageNum: {
    type: Number,
    default: 1,
  },
  pageSize: {
    type: Number,
    default: 20,
  },

  pageShowSize: {
    type: Number,
    default: 2,
  },

  round: {
    type: Boolean,
    default: false,
  },
  pageSizeOptions: {
    type: Array as PropType<Options[]>,
    default() {
      return [
        {
          label: '10 / 页',
          value: '10',
        },
        {
          label: '20 / 页',
          value: '20',
        },
        {
          label: '30 / 页',
          value: '30',
        },
        {
          label: '50 / 页',
          value: '50',
        },
        {
          label: '100 / 页',
          value: '100',
        },
      ]
    },
  },
})

const generateArray = (start: any, end: any) => {
  return Array.from(new Array(end + 1).keys()).slice(start)
}

let pageNum = ref(props.pageNum)
let pageSize = ref(props.pageSize)

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

let maxLen = computed(() => {
  return Math.ceil(props.total / pageSize.value)
})

let pageInterval = computed(() => {
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

  if (end == 1 && props.total > pageSize.value) {
    end += 1
  }

  let pageArr = generateArray(start, end)

  if (pageArr.length < 1) {
    pageArr = [1]
  }

  return pageArr
})

const emit = defineEmits(['update:pageNum', 'update:pageSize', 'change'])

const changePage = (type: any, num: number) => {
  if (type == 'next') {
    pageNum.value += num
  } else if (type == 'prve') {
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

let pageSizebackup = ref('20')

const checkPageSize = (e: any) => {
  if (!e) {
    return
  }

  let pageSizeStr = e
  pageSizeStr = e.replace(/[^\d]/g, '')
  let pageSizeNum = Number(pageSizeStr)
  if (pageSizeNum < 1) {
    pageSizeNum = 1
  }
  pageSize.value = pageSizeNum
  changePage(false, pageNum.value)
}
</script>

<template>
  <div
    class="lew-pagination"
    :class="{
      'lew-pagination-round': round,
    }"
  >
    <div class="lew-pagination-control" gap="5px">
      <div class="lew-pagination-page-box" gap="5px">
        <div @click="changePage('prve', 1)" class="lew-pagination-page-btn lew-pagination-control-btn">
          <lew-icon size="14" type="chevron-left" />
        </div>
        <div
          v-show="pageNum - 1 > pageShowSize && maxLen > pageShowSize * 2 + 7"
          class="lew-pagination-page-btn"
          @click="changePage(false, 1)"
        >
          1
        </div>
        <div
          v-show="pageNum - 1 > pageShowSize && maxLen > pageShowSize * 2 + 7 && pageInterval[0] != 1 + 1"
          class="lew-pagination-page-btn lew-pagination-control-btn"
          @click="changePage('prve', pageShowSize * 2)"
        >
          <ICaretDown width="16" height="16" class="rotate-90" />
          <!-- <lew-icon size="14" type="more-horizontal" /> -->
        </div>

        <div
          v-for="(item, index) in pageInterval"
          :key="index"
          class="lew-pagination-page-btn"
          :class="{ active: item == pageNum }"
          @click="changePage(false, item)"
        >
          {{ item }}
        </div>

        <div
          v-show="
            pageNum < maxLen - pageShowSize &&
            maxLen > pageShowSize * 2 + 7 &&
            pageInterval[pageInterval.length - 1] + 1 != maxLen
          "
          class="lew-pagination-page-btn lew-pagination-control-btn"
          @click="changePage('next', pageShowSize * 2)"
        >
          <ICaretDown width="16" height="16" class="rotate-270" />
          <!-- <lew-icon size="14" type="more-horizontal" /> -->
        </div>

        <div
          v-show="pageNum < maxLen - pageShowSize && maxLen > pageShowSize * 2 + 7"
          class="lew-pagination-page-btn"
          @click="changePage(false, maxLen)"
        >
          {{ maxLen }}
        </div>
        <div class="lew-pagination-page-btn lew-pagination-control-btn" @click="changePage('next', 1)">
          <lew-icon size="14" type="chevron-right" />
        </div>
      </div>
      <!-- <lew-select
                style="width: 100px"
                align="center"
                v-model="pageSizebackup"
                @change="checkPageSize"
                size="small"
                :show-icon="false"
                :options="pageSizeOptions"
            >
            </lew-select> -->
    </div>
  </div>
</template>

<style lang="scss">
.lew-pagination {
  display: inline-block;
  box-sizing: border-box;
  height: 40px;
  border-radius: 4px;
  user-select: none;
  font-size: 14px;

  .lew-pagination-control {
    height: 100%;
    color: black;
  }

  .lew-pagination-page-box {
    width: auto;
    position: relative;
    height: 100%;

    .lew-pagination-page-btn {
      position: relative;
      z-index: 2;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      height: 26px;
      min-width: 26px;
      padding: 0px 4px;
      box-sizing: border-box;
      border-radius: 4px;
      text-align: center;
      cursor: pointer;
    }

    .lew-pagination-page-btn:hover {
      background-color: blue;
      color: white;
    }

    .active {
      background-color: dodgerblue;
      color: white;
    }

    .active:hover {
      background-color: dodgerblue;
      color: white;
    }

    .lew-pagination-control-btn {
      padding: 0px;
    }
  }

  .page-label {
    white-space: nowrap;
    padding: 0px 5px;
  }
}

.lew-pagination-round {
  .lew-pagination-page-box {
    .lew-pagination-page-btn {
      border-radius: 30px;
    }
  }
}
</style>
