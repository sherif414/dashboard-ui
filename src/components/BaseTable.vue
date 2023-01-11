<template>
  <div class="flex flex-col grow p4 px-8 gap-y-4 surface-1 rounded-md overflow-auto">
    <!-- header  -->
    <caption v-if="!hideHeader" class="flex items-center gap-x-4 typo-sm">
      <!-- search box -->
      <h2 class="typo-head capitalize">{{ tableTitle ?? tableName }}</h2>
      <TextField v-if="showSearch" wrapper-class="ml-4" size="sm" placeholder="search" v-model.noLazy="searchValue">
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
          class="sticky top-1px left-0 w-full z-1 left-0 capitalize surface-1 outline-1 outline dark:outline-dark-3 outline-gray-2"
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
              <td v-for="(v, k) in row" :key="k" class="p2 px-4">{{ v || '-' }}</td>
            </tr>
          </tbody>
        </slot>
      </table>
    </div>

    <!-- pagination -->
    <div class="border-t border-gray-2 dark:border-dark-3 flex items-center pt-2 mt-auto">
      <slot name="pagination">
        <span>
          <input
            min="1"
            :max="itemsCount || undefined"
            class="p1 surface-2 w-8 hide-arrows active:outline-none focus:outline-none"
            type="number"
            :value="itemsPerPage"
            @change="onChangeItemsPerPage"
          />
          items / page</span
        >
        <div class="flex items-center ml-auto">
          <input
            min="1"
            :max="Math.ceil((itemsCount ?? 0) / itemsPerPage)"
            class="p1 surface-2 w-8 mr-2 hide-arrowss active:outline-none focus:outline-none"
            type="number"
            v-model="page"
          />
          <span class="mr-2"> of {{ Math.ceil((itemsCount ?? 0) / itemsPerPage) }} pages</span>
          <ICaretDown
            @click="changePage('prev')"
            width="16"
            height="16"
            class="rotate-90 p2 rounded box-content"
            :class="[page === 1 ? 'opacity-30 cursor-default pointer-events-none' : 'hover:surface-2 cursor-pointer']"
          />
          <ICaretDown
            @click="changePage('next')"
            width="16"
            height="16"
            class="rotate-270 p2 rounded box-content"
            :class="[
              page === lastPage ? 'opacity-30 cursor-default pointer-events-none' : 'hover:surface-2 cursor-pointer',
            ]"
          />
        </div>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getTableDataParams } from 'types'
import { supabase } from '../api'

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

const headers = $computed(() => (data && data.length ? Object.keys(data[0]) : null))

// pagination
let page = $ref(1)
let orderBy = $ref({ column: orderColumn, foreignTable: '', ascending: false })
let itemsPerPage = $ref(10)
let lastPage = $computed(() => Math.ceil((itemsCount ?? 0) / itemsPerPage))

function changePage(to: 'next' | 'prev') {
  if (to === 'next' && page < lastPage) page++
  else if (to === 'prev' && page > 1) page--
}

function onChangeItemsPerPage(e: Event) {
  let _value = +(e.target as HTMLInputElement).value
  if (itemsCount && _value <= itemsCount) {
    itemsPerPage = _value
    page = 1
  }
}

// sorting
function sort(column: string, foreignTable?: string) {
  if (!getData) return
  if (!foreignTable === !orderBy.foreignTable && orderBy.column === column) orderBy.ascending = !orderBy.ascending
  else orderBy.ascending = false

  orderBy.column = column
  orderBy.foreignTable = foreignTable || ''
  getData({ page, itemsPerPage, orderOptions: { ...orderBy } })
}

if (getData) {
  watchDebounced($$(page), () => getData({ page, itemsPerPage, orderOptions: orderBy }), {
    debounce: 300,
    flush: 'post',
  })
}

// searching
let searchValue = $ref<string>('')
let searchResults = $ref<{ id: string; name: string }[] | null>(null)
let isSearching = $ref(false)

async function search() {
  if (!searchValue) return
  isSearching = true
  let _searchTerm = searchValue.split(' ').join(':*&') + ':*'

  const { data } = await supabase.from(tableName).select('id, name').textSearch('name', _searchTerm).limit(10)
  searchResults = data
  isSearching = false
}
if (showSearch) {
  watchDebounced($$(searchValue), search, { debounce: 500 })
}

const router = useRouter()
function handleSearchResultClick(id: string) {
  router.push(`/${tableName}/${id}`)
}
</script>
