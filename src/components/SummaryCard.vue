<template>
  <article :class="[fill, 'rounded-md typo-sm p4 flex flex-col justify-between gap-y-4']">
    <div class="flex justify-between">
      <slot name="icon" />
      <div>
        this week
        <ICaretDown class="ml-1 inline" width="12" height="12" />
      </div>
    </div>
    <div class="flex justify-between text-left">
      <div v-for="{ name, value, growth } in data" :key="name">
        <h2 class="capitalize">{{ name }}</h2>
        <h3 class="typo-head">
          {{ value ? value : '' }}
          <span v-if="growth" class="text-success typo-sm">{{ growth }}</span>
        </h3>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
const { fill = 'surface-1' } = defineProps<{
  data: { name: string; value?: string | number; growth?: string | number }[]
  fill?: string
}>()
</script>
