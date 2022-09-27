<template>
  <div class="overflow-auto flex flex-col">
    <table class="typo-base">
      <thead class="border-b border-gray-2 dark:border-dark-3 surface-1 capitalize">
        <tr class="text-left">
          <th class="p-2 px-1">
            <input type="checkbox" />
          </th>
          <th v-for="head in headings" :key="head">
            <div class="flex items-center">
              {{ head }}
              <ISort class="ml2" />
            </div>
          </th>
        </tr>
      </thead>
      <tbody class="typo-sm">
        <tr v-for="row in data" :key="row[0] + 'row'">
          <td class="py2 px1">
            <input type="checkbox" />
          </td>
          <td v-for="item in row" :key="item" class="py2">
            {{ item }}
          </td>
          <td>
            <Chip variant="completed" />
          </td>
          <td>
            <Chip variant="pending" />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  data: string[][]
}>()
const headings = ['customer name', 'order date', 'order type', 'tracking ID', 'order total', 'action', 'status']
</script>
