<script setup lang="ts">
defineProps<{
  data: { name: string; value: string | number; growth?: string | number }[]
}>()
</script>

<template>
  <article class="rounded-3 p4 flex flex-col justify-between text-3 gap-y-4 surface">
    <div class="flex justify-between">
      <div class="p2 rounded-3 dark:bg-dark-200 bg-secondary-30">
        <slot name="icon" />
      </div>
      <div class="text-black-30">
        this week
        <ICaretDown class="ml-1 inline dark:[&_path]:stroke-gray-1 [&_path]:stroke-dark-1" width="12" height="12" />
      </div>
    </div>
    <div class="flex justify-between">
      <div v-for="{ name, value, growth } in data" :key="name">
        <h2 class="capitalize grow">{{ name }}</h2>
        <h3 class="text-4 font-medium grow">
          ${{ value }} <span v-if="growth" class="text-(green-2 body)">{{ growth }}</span>
        </h3>
      </div>
    </div>
  </article>
</template>
