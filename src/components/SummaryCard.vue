<template>
  <article :class="[fill, 'rounded-3 p4 flex flex-col justify-between text-3 gap-y-4']">
    <div class="flex justify-between">
      <slot name="icon" />
      <div class="text-black-30">
        this week
        <ICaretDown class="ml-1 inline" width="12" height="12" />
      </div>
    </div>
    <div class="flex justify-between">
      <div v-for="{ name, value, growth } in data" :key="name">
        <h2 class="capitalize">{{ name }}</h2>
        <h3 class="typo-head">
          {{ value }} <span v-if="growth" class="text-success typo-sm">{{ growth }}</span>
        </h3>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
const { fill = 'surface-1' } = defineProps<{
  data: { name: string; value: string | number; growth?: string | number }[]
  fill?: string
}>()
</script>
