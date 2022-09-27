<template>
  <section
    class="flex flex-col surface-1 divide-y dark:divide-dark-300 divide-gray-2 rounded-3 p4 text-left overflow-auto"
  >
    <h2 class="typo-head mb-2">Recent Orders</h2>
    <div v-for="i in 100" :key="i" class="flex items-center justify-start gap-x-4 py2">
      <div class="w-12 h-12"><img src="../assets/img/iphone14.png" /></div>
      <div class="flex flex-col gap-y-1">
        <h2>Iphone 14</h2>
        <h3>$1,099</h3>
      </div>
      <div class="flex flex-col items-start gap-y-1 ml-auto">
        <span class="typo-clr-muted">19 sep 2022 </span>
        <Chip :variant="i % 2 === 0 ? 'pending' : 'completed'" />
      </div>
    </div>
  </section>
</template>
