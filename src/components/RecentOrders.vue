<template>
  <section class="flex flex-col surface-1 divide-y dark:divide-dark-300 divide-gray-2 rounded-md p4">
    <h2 class="typo-head mb-2">Recent Orders</h2>
    <div class="relative grow">
      <ul
        class="divide-y dark:divide-dark-300 divide-gray-2 overflow-y-auto z-0 w-full h-full absolute top-0 left-0 pr-1"
        v-if="data"
      >
        <li v-for="product in data" :key="product.id" class="flex items-center justify-start gap-x-4 py2">
          <div><img width="48" heigh="48" src="../assets/img/iphone14.png" /></div>
          <div class="inline-flex flex-col gap-y-1">
            <h2>{{ product.name }}</h2>
            <h3>{{ product.sell_price ? `$ ${product.sell_price}` : '-' }}</h3>
          </div>
          <div class="inline-flex flex-col items-end items-start gap-y-1 ml-auto">
            <span class="typo-clr-muted">{{ new Date(product.created_at!).toLocaleTimeString() }} </span>
            <Chip :status="product.published">{{ product.published ? 'published' : 'not published' }}</Chip>
          </div>
        </li>
      </ul>
    </div>
  </section>
</template>

<script setup lang="ts">
const data: any = []
</script>
