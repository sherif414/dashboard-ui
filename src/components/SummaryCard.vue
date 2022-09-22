<script setup lang="ts"></script>

<template>
  <article class="rounded-3 p4 flex flex-col justify-between text-3 gap-y-4 surface">
    <div class="flex justify-between">
      <div class="p2 rounded-3 dark:bg-dark-200 bg-primary-10">
        <slot name="icon">
          <ICustomers
            width="16"
            height="16"
            class="[&_path]:dark:fill-secondary-90 [&_path]:dark:stroke-secondary-90 [&_path]:stroke-primary-90"
          />
        </slot>
      </div>
      <div class="text-black-30">this week</div>
    </div>
    <div class="grid grid-cols-2">
      <div>
        <h2 class="capitalize">sales</h2>
        <h3 class="text-4 font-meduim">$400.000.00</h3>
      </div>
      <div>
        <h2 class="capitalize">volume</h2>
        <h3 class="text-4 font-bold">450 <span class="text-green-300">+20.00%</span></h3>
      </div>
    </div>
  </article>
</template>
