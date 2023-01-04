<template>
  <div class="relative">
    <TextField v-bind="$attrs" v-model.noLazy="searchValue">
      <template #prepend>
        <ISearch width="20" height="20" />
      </template>
      <template #append>
        <div :class="!isLoading ? 'opacity-0' : 'opacity-100'" class="loading" />
      </template>
    </TextField>
    <ul
      v-show="searchResults?.length"
      class="absolute left-0 top-110% max-h-8rem overflow-y-auto p2 w-full surface-1 rounded-md shadow border flex flex-col"
    >
      <li v-for="obj in searchResults" :key="obj.id">{{ obj['name'] }}</li>
    </ul>
  </div>
</template>

<script setup lang="ts">
const { searchFn } = defineProps<{
  searchFn: (searchTerm: string) => Promise<object[] | null>
}>()
let searchResults = $ref<any[] | null>(null)
let searchValue = $ref('')
let isLoading = $ref(false)

async function search() {
  isLoading = true
  searchResults = await searchFn(searchValue)
  isLoading = false
}

watch($$(searchValue), () => {
  isLoading = true
})
watchDebounced($$(searchValue), search, { debounce: 1000 })
</script>
