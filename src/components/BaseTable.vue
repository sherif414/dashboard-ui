<template>
  <div class="flex flex-col grow p-4 sm:p-6 gap-y-4 surface-1 rounded-md overflow-auto border border-gray-2 dark:border-dark-3">
    <!-- header  -->
    <caption v-if="!hideHeader" class="flex flex-wrap items-center gap-4 typo-sm">
      <!-- search box -->
      <h2 class="typo-head capitalize">{{ tableTitle ?? tableName }}</h2>
      <TextField v-if="showSearch" wrapper-class="ml-0 sm:ml-4" size="sm" placeholder="search" v-model.noLazy="searchValue">
        <template #prepend>
          <ISearch class="w4! h4!" />
        </template>
        <template #append>
          <div :class="isSearching ? 'opacity-100' : 'opacity-0'" class="loading" />
        </template>
        <template #dropdown>
          <ul
            class="absolute z-9 max-h-56 w-full rounded-md overflow-auto divide-y-1 dark:divide-dark-3 surface-2 shadow-md top-115% border border-gray-2 dark:border-dark-3 left-0 hidden [input:active~&]:block [input:focus~&]:block"
            v-if="searchResults?.length"
          >
            <li
              class="p2 flex items-center gap-x-2 typo-sm typo-clr-muted hover:surface-1 cursor-pointer"
              v-for="item in searchResults"
              :key="item.id"
              @click="handleSearchResultClick(item.id)"
            >
              <span class="typo-clr-base">
                {{ item.name }}
              </span>
            </li>
          </ul>
        </template>
      </TextField>
    </caption>

    <!-- table -->
    <div class="overflow-auto grow">
      <table class="typo-base w-full">
        <thead
          class="sticky top-0 left-0 w-full z-1 capitalize surface-1 outline-1 outline dark:outline-dark-3 outline-gray-2"
        >
          <tr class="text-left">
            <slot name="header" :orderBy="orderBy" :sort="sort">
              <template v-if="headers">
                <TableHeaderCell
                  v-for="header in headers"
                  :key="header"
                  :column="header"
                  :sort-ascending="orderBy.ascending"
                  :order-by="orderBy.column"
                  @sort="sort(header)"
                >
                  {{ header }}
                </TableHeaderCell>
              </template>
            </slot>
          </tr>
        </thead>
        <slot name="body">
          <tbody v-if="data" class="typo-sm">
            <tr v-for="(row, idx) in data" :key="idx">
              <td v-for="(v, k) in (row as any)" :key="k" class="p2 px-4">{{ v || '-' }}</td>
            </tr>
          </tbody>
        </slot>
      </table>
    </div>

    <!-- pagination -->
    <div class="border-t border-gray-2 dark:border-dark-3 flex flex-wrap items-center justify-between gap-2 pt-3 mt-auto typo-sm">
      <slot name="pagination">
        <span class="flex items-center gap-1.5">
          <input
            min="1"
            aria-label="Items per page"
            :max="itemsCount || undefined"
            class="p1 surface-2 w-10 text-center rounded border border-gray-2 dark:border-dark-3 hide-arrows active:outline-none focus:outline-none"
            type="number"
            :value="itemsPerPage"
            @change="onChangeItemsPerPage"
          />
          <span class="typo-clr-muted">items / page</span>
        </span>
        <div class="flex items-center ml-auto gap-1">
          <input
            min="1"
            aria-label="Current page number"
            :max="Math.ceil((itemsCount ?? 0) / itemsPerPage)"
            class="p1 surface-2 w-10 text-center rounded border border-gray-2 dark:border-dark-3 hide-arrows active:outline-none focus:outline-none"
            type="number"
            v-model="page"
          />
          <span class="mr-2 typo-clr-muted"> of {{ Math.ceil((itemsCount ?? 0) / itemsPerPage) }} pages</span>
          <button
            type="button"
            aria-label="Previous page"
            @click="changePage('prev')"
            class="p-1 rounded transition"
            :class="[page === 1 ? 'opacity-30 cursor-default pointer-events-none' : 'hover:surface-2 cursor-pointer']"
          >
            <ICaretDown width="16" height="16" class="rotate-90" />
          </button>
          <button
            type="button"
            aria-label="Next page"
            @click="changePage('next')"
            class="p-1 rounded transition"
            :class="[page === lastPage ? 'opacity-30 cursor-default pointer-events-none' : 'hover:surface-2 cursor-pointer']"
          >
            <ICaretDown width="16" height="16" class="rotate-270" />
          </button>
        </div>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { watchDebounced } from '@vueuse/core'
import type { getTableDataParams } from 'types'
import { supabase } from '../api'
import TextField from '~/components/TextField.vue'
import TableHeaderCell from '~/components/TableHeaderCell.vue'
import { ISearch, ICaretDown } from '~/components/icons'

interface Props {
  data: object[] | null
  tableName: string
  tableTitle?: string
  itemsCount: number | null
  showSearch?: boolean
  orderColumn?: string
  hideHeader?: boolean
  getData?: (params: getTableDataParams) => Promise<void>
}

const {
  showSearch = true,
  tableName,
  itemsCount,
  getData,
  data,
  orderColumn = 'id',
  hideHeader = false,
} = defineProps<Props>()

const headers = computed(() => (data && data.length ? Object.keys(data[0]) : null))

// pagination
const page = ref(1)
const orderBy = ref({ column: orderColumn, foreignTable: '', ascending: false })
const itemsPerPage = ref(10)
const lastPage = computed(() => Math.ceil((itemsCount ?? 0) / itemsPerPage.value))

function changePage(to: 'next' | 'prev') {
  if (to === 'next' && page.value < lastPage.value) page.value++
  else if (to === 'prev' && page.value > 1) page.value--
}

function onChangeItemsPerPage(e: Event) {
  let _value = +(e.target as HTMLInputElement).value
  if (itemsCount && _value <= itemsCount) {
    itemsPerPage.value = _value
    page.value = 1
  }
}

// sorting
function sort(column: string, foreignTable?: string) {
  if (!getData) return
  if (!foreignTable === !orderBy.value.foreignTable && orderBy.value.column === column) {
    orderBy.value.ascending = !orderBy.value.ascending
  } else {
    orderBy.value.ascending = false
  }

  orderBy.value.column = column
  orderBy.value.foreignTable = foreignTable || ''
  getData({ page: page.value, itemsPerPage: itemsPerPage.value, orderOptions: { ...orderBy.value } })
}

if (getData) {
  watchDebounced(page, () => getData({ page: page.value, itemsPerPage: itemsPerPage.value, orderOptions: orderBy.value }), {
    debounce: 300,
    flush: 'post',
  })
}

// searching
const searchValue = ref<string>('')
const searchResults = ref<{ id: string; name: string }[] | null>(null)
const isSearching = ref(false)

async function search() {
  if (!searchValue.value) return
  isSearching.value = true
  let _searchTerm = searchValue.value.split(' ').join(':*&') + ':*'

  const { data } = await supabase.from(tableName).select('id, name').textSearch('name', _searchTerm).limit(10)
  searchResults.value = data
  isSearching.value = false
}

if (showSearch) {
  watchDebounced(searchValue, search, { debounce: 500 })
}

const router = useRouter()
function handleSearchResultClick(id: string) {
  router.push(`/${tableName}/${id}`)
}
</script>
