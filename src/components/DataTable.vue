<template>
  <div class="overflow-auto flex flex-col">
    <table class="typo-base">
      <thead class="border-y text-black-90 dark:border-dark-3 border-gray-3 capitalize dark:text-white">
        <tr class="text-left">
          <th class="p-1">
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
      <tbody class="text-black-30 typo-sm">
        <tr v-for="x in 20" :key="x">
          <td class="py2 px1">
            <input type="checkbox" />
          </td>
          <td v-for="item in data.rows" :key="item" class="py2">
            {{ item }}
          </td>
          <td class="dark:text-white">
            <Chip variant="completed" />
          </td>
          <td class="dark:text-white">
            <Chip variant="pending" />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  data: { headings: string[]; rows: string[] }
}>()
</script>
