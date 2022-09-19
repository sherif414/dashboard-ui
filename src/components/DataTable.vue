<template>
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
}>()
</script>
