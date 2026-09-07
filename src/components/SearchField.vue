<template>
  <TextField placeholder="search products" v-model.noLazy="searchValue">
    <template #prepend>
      <ICustomers width="20" height="20" />
    </template>
    <template #append>
      <div :class="isSearching ? 'opacity-100' : 'opacity-0'" class="loading" />
    </template>
    <template #dropdown>
      <ul
        class="typo-sm absolute z-9 max-h-56 w-full rounded-md overflow-auto divide-y-1 dark:divide-dark-3 surface-2 shadow-md top-115% border border-gray-2 dark:border-dark-3 left-0 hidden [input:active~&]:flex [input:focus~&]:flex flex-col"
        v-if="searchResults?.length"
      >
        <li
          class="p2 hover:surface-1 cursor-pointer"
          v-for="item in searchResults"
          :key="item.id"
          @click="handleSelected(item.name, item.id)"
        >
          {{ item.name }}
        </li>
      </ul>
    </template>
  </TextField>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { watchDebounced } from '@vueuse/core'
import { supabase } from '../api'
import { useMessage } from '~/composables/message'
import TextField from '~/components/TextField.vue'
import { ICustomers } from '~/components/icons'

interface Props {
  searchFn?: (searchTerm: string) => Promise<SearchResults>
  tableName?: string
}
interface Emits {
  (event: 'selected', id: string): void
}

const { searchFn, tableName } = defineProps<Props>()
const emit = defineEmits<Emits>()

const searchResults = ref<SearchResults>(null)
const searchValue = ref('')
const isSearching = ref(false)

async function getResults(searchTerm: string) {
  const { data, error } = await supabase
    .from(tableName || '')
    .select('id, name')
    .textSearch('name', searchTerm.split(' ').join(':*&') + ':*')
    .limit(10)
  if (error) useMessage('error', error.message ?? 'an error has occurred')
  return data as SearchResults
}

watchDebounced(
  searchValue,
  async () => {
    isSearching.value = true
    searchResults.value = searchFn ? await searchFn(searchValue.value) : await getResults(searchValue.value)
    isSearching.value = false
  },
  { debounce: 1000 }
)

function handleSelected(name: string, id: string) {
  emit('selected', id)
}

type SearchResults = { id: string; name: string }[] | null
</script>
