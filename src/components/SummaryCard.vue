<template>
  <article :class="[fill, 'rounded-md typo-sm p4 flex flex-col justify-between gap-y-4 2xl:gap-y-8']">
    <div class="flex justify-between">
      <div class="flex gap-2">
        <slot name="icon" />
      </div>
      <div v-if="filter">
        this week
        <ICaretDown class="ml-1 inline" width="12" height="12" />
      </div>
    </div>
    <div class="flex justify-between text-left">
      <div v-for="{ name, value, growth } in data" :key="name">
        <h2 class="capitalize opacity-80">{{ name }}</h2>
        <h3 class="typo-base">
          {{ value ? value : '?' }}
          <span v-if="growth" class="text-success typo-sm">{{ growth }}</span>
        </h3>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
const { filter = true, fill = 'surface-1' } = defineProps<{
  data: { name: string; value?: string | number | null; growth?: string | number }[]
  fill?: string
  filter?: boolean
}>()
</script>
