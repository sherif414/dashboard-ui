<template>
  <div class="flex flex-col grow p4 px-8 gap-y-4 surface-1 rounded-md overflow-y-auto">
    <!-- header  -->
    <caption class="flex items-center gap-x-2 typo-sm">
      <h1 class="typo-head">products table</h1>

      <!-- search box -->
      <label class="relative p-2 surface-2 rounded-md ml-auto typo-sm flex items-center gap-x-2">
        <ISearch width="16" height="16" />
        <input
          v-model="searchValue"
          type="search"
          placeholder="search.."
          class="focus:outline-none active:outline-none bg-inherit"
        />
        <div
          class="absolute z-10 top-10 shadow w-full flex flex-col left-0 py-2 items-center justify-center surface-2 max-h-10rem overflow-y-auto"
          v-if="searchValue && searchValue.length > 0"
        >
          <div v-if="(!searchResult || searchResult?.length === 0) && searchValue?.length > 0">
            <ILoading class="w-8 p1 h-8 relative! typo-clr-primary" />
          </div>
          <div
            class="p2 hover:(fill-primary-2 typo-clr-on-primary) cursor-pointer w-full text-start"
            v-for="item in searchResult"
          >
            {{ item.name }}
          </div>
        </div>
      </label>

      <!-- filters -->
      <FilterMenu />
      <FilterDate />
      <BulkAction />
    </caption>

    <!-- table -->
    <div class="overflow-auto flex flex-col">
      <table class="typo-base">
        <thead class="border-y border-gray-2 dark:border-dark-3 surface-1 capitalize">
          <tr class="text-left">
            <slot name="headings">
              <td
                class="p2 px-4 hover:bg-gray-1 dark:hover:bg-dark-4 cursor-pointer"
                @click="sort(head)"
                v-for="head in headers"
                :key="head"
              >
                <div class="flex items-center justify-between">
                  {{ head }}
                  <ISort
                    :class="{
                      'rotate-180 ': orderBy === head && !ascending,
                      'typo-clr-primary': orderBy === head,
                    }"
                    class="ml2 transition-transform rotate-0"
                  />
                </div>
              </td>
            </slot>
          </tr>
        </thead>
        <tbody class="typo-sm">
          <slot name="body">
            <template v-if="data">
              <tr v-for="(row, idx) in data" :key="idx">
                <td v-for="(v, k) in row" :key="k" class="p2 px-4">{{ v || '-' }}</td>
              </tr>
            </template>
          </slot>
        </tbody>
      </table>
    </div>

    <!-- pagination -->
    <div class="border-t border-gray-2 dark:border-dark-3 flex items-center pt-2 mt-auto">
      <slot name="pagination">
        <span>
          <input
            min="1"
            class="p1 surface-2 w-8 hide-arrows active:outline-none focus:outline-none"
            type="number"
            v-model.lazy="itemsPerPage"
          />
          items / page</span
        >
        <div class="flex items-center ml-auto">
          <span class="mr-2">{{ page }} of {{ Math.ceil((itemsCount ?? 0) / itemsPerPage) }} pages</span>
          <ICaretDown
            @click="changePage('prev')"
            width="16"
            height="16"
            class="rotate-90 p2 rounded box-content"
            :class="[page === 1 ? 'opacity-30 cursor-default pointer-events-none' : 'hover:bg-gray-2 cursor-pointer']"
          />
          <ICaretDown
            @click="changePage('next')"
            width="16"
            height="16"
            class="rotate-270 p2 rounded box-content"
            :class="[
              page === lastPage ? 'opacity-30 cursor-default pointer-events-none' : 'hover:bg-gray-2 cursor-pointer',
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

// props
const { tableName, itemsCount, getData } = defineProps<{
  data: object[] | null
  headers: string[]
  tableName: string
  itemsCount: number | null
  getData: (params: getTableDataParams) => Promise<void>
}>()

let page = $ref(1)
let orderBy = $ref('id')
let ascending = $ref(true)
let itemsPerPage = $ref(10)
let lastPage = $computed(() => Math.ceil((itemsCount ?? 0) / itemsPerPage))

// pagination
function changePage(to: 'next' | 'prev') {
  if (to === 'next' && page < lastPage) page++
  else if (to === 'prev' && page > 1) page--
}

// sorting
function sort(column: string) {
  if (column === orderBy) ascending = !ascending
  else ascending = true

  orderBy = column
  getData({ page, itemsPerPage, orderBy, ascending })
}

// searching
let searchValue = $ref<string>('')
let searchResult = $ref<any[] | null>(null)

async function search() {
  if (searchValue.length < 3) return
  searchValue = searchValue.toLocaleLowerCase().trim()
  const { data } = await supabase
    .from(tableName)
    .select('id, name')
    .textSearch('name', searchValue, { type: 'websearch' })
    .range(0, 5)
  searchResult = data
}

watchDebounced(
  [$$(itemsPerPage), $$(page)],
  () => {
    getData({ page, itemsPerPage, orderBy, ascending })
  },
  { debounce: 300 }
)

watchDebounced($$(searchValue), search, { debounce: 1000 })
</script>
