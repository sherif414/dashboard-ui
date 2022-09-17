<template>
  <caption class="py4 flex items-center gap-x-2 font-semibold capitalize">
    <h1 class="">
      {{ title }}
    </h1>
    <input
      type="search"
      placeholder="search.."
      class="px2 py1 border text-3 rounded ml-auto border-line focus:outline-none"
    />
    <!-- filter menu -->
    <FilterMenu />
    <!-- filter by date menu  -->
    <button class="border border-black-10 px2 py1 text-3 rounded flex items-center gap-x-2">
      <ICalender width="14" height="14" /> filter
    </button>
    <button class="border border-black-10 px2 py1 text-3 rounded flex items-center gap-x-2">
      Bulk Action <ICaretDown width="14" height="14" />
    </button>
  </caption>
  <table class="w-full text-0.8725rem">
    <thead class="border-y text-black-90 border-line capitalize">
      <tr class="text-left">
        <th class="py3 px1">
          <input type="checkbox" />
        </th>
        <th v-for="head in data.headings" :key="head">
          <div class="flex items-center">
            {{ head }}
            <ISort class="ml2" />
          </div>
        </th>
      </tr>
    </thead>
    <tbody class="text-black-30">
      <tr v-for="x in 20" :key="x">
        <td class="py4 px1">
          <input type="checkbox" />
        </td>
        <td v-for="item in data.rows" :key="item" class="py4">
          {{ item }}
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup lang="ts">
defineProps<{
  data: { headings: string[]; rows: string[] }
  title: string
}>()
</script>
