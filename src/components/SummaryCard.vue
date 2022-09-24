<script setup lang="ts">
defineProps<{
  data: { name: string; value: string | number; growth?: string | number }[]
}>()
</script>

<template>
  <article class="rounded-3 p4 flex flex-col justify-between text-3 gap-y-4 surface-1">
    <div class="flex justify-between">
      <slot name="icon" />
      <div class="text-black-30">
        this week
        <ICaretDown class="ml-1 inline" width="12" height="12" />
      </div>
    </div>
    <div class="flex justify-between">
      <div v-for="{ name, value, growth } in data" :key="name">
        <h2 class="capitalize grow">{{ name }}</h2>
        <h3 class="text-4 font-medium grow">
          {{ value }} <span v-if="growth" class="text-(green-2 body)">{{ growth }}</span>
        </h3>
      </div>
    </div>
  </article>
</template>
