<template>
  <section
    class="flex flex-col surface-1 divide-y dark:divide-dark-300 divide-gray-2 rounded-3 p4 text-left overflow-auto"
  >
    <h2 class="typo-head mb-2">Recent Orders</h2>
    <template v-if="store.productsList">
      <div v-for="product in store.productsList" :key="product.id" class="flex items-center justify-start gap-x-4 py2">
        <div><img width="48" heigh="48" src="../assets/img/iphone14.png" /></div>
        <div class="flex flex-col gap-y-1">
          <h2>{{ product.name }}</h2>
          <h3>${{ product.sell_price }}</h3>
        </div>
        <div class="flex flex-col items-end items-start gap-y-1 ml-auto">
          <span class="typo-clr-muted">{{ new Date(product.created_at!).toLocaleTimeString() }} </span>
          <Chip :status="product.published">{{ product.published ? 'published' : 'not published' }}</Chip>
        </div>
      </div>
    </template>
    <h2 v-else>loading</h2>
  </section>
</template>

<script setup lang="ts">
import { useProductsStore } from '~/store/products'

const store = useProductsStore()
</script>
