<template>
  <BaseTable>
    <template #headings>
      <th class="py2 px1">
        <input type="checkbox" />
      </th>
      <th v-for="head in headings" :key="head">
        <div class="flex items-center">
          {{ head }}
          <ISort class="ml2" />
        </div>
      </th>
    </template>
    <template v-if="store.productsList" #body>
      <tr v-for="product in store.productsList" :key="product.id">
        <td class="py2 px1">
          <input type="checkbox" />
        </td>
        <td class="py2">{{ product.id }}</td>
        <td class="py2">{{ product.name }}</td>
        <td class="py2">{{ new Date(product.created_at!).toDateString() }}</td>
        <td class="py2">${{ product.price }}</td>
        <td class="py2">{{ product.stock }}</td>
        <td class="py2">{{ product.discount }}</td>
        <td class="py2">{{ product.category }}</td>
        <td>
          <Chip :status="product.published">{{ product.published ? 'published' : 'not published' }}</Chip>
        </td>
      </tr>
    </template>
  </BaseTable>
</template>

<script setup lang="ts">
import { useProductsStore } from '~/store/products'

const store = useProductsStore()

const headings = ['id', 'name', 'created_at', 'price', 'stock', 'discount', 'category', 'status']
</script>
