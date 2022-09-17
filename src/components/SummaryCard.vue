<script setup lang="ts">
const { bgColor = 'bg-white' } = defineProps<{
  bgColor?: string
}>()
</script>

<template>
  <article class="rounded-3 px4 py2 flex flex-col justify-between text-3 gap-y-6" :class="bgColor">
    <div class="flex justify-between">
      <div class="p2 rounded-3 bg-primary-10">
        <slot name="icon">
          <ICustomers class="w-4 h-4 [&_path]:stroke-primary-90" />
        </slot>
      </div>
      <div class="text-black-30">this week</div>
    </div>
    <div class="grid grid-cols-2">
      <div>
        <h2 class="capitalize">sales</h2>
        <h3 class="text-4 font-bold">$400.000.00</h3>
      </div>
      <div>
        <h2 class="capitalize">volume</h2>
        <h3 class="text-4 font-bold">450 <span class="text-success">+20.00%</span></h3>
      </div>
    </div>
  </article>
</template>
