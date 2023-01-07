<template>
  <main class="p4 flex flex-col gap-y-4 overflow-y-auto">
    <!-- header -->
    <router-link
      to="/products/add"
      class="fixed bottom-24 right-20 fill-primary-2 hover:fill-primary-3 transition typo-clr-on-primary rounded-full p-3 shadow-lg"
    >
      <IAdd />
    </router-link>

    <!-- summary cards -->
    <div class="grid grid-cols-2 gap-x-6 row-span-1">
      <SummaryCard
        :filter="false"
        fill="primary"
        :data="[
          { name: 'all products', value: store.countAll },
          { name: 'published', value: store.countPublished },
          { name: 'unpublished', value: (store.countAll ?? 0) - (store.countPublished ?? 0) },
        ]"
      >
        <template #icon>
          <IInventory width="18" height="18" class="summary-icon fill-primary-3 typo-clr-on-primary!" />
        </template>
      </SummaryCard>

      <SummaryCard
        :filter="false"
        :data="[
          { name: 'out of stock', value: '5' },
          { name: 'expired', value: '2' },
          { name: '1 star rating', value: '3' },
        ]"
      >
        <template #icon>
          <IInventory width="18" height="18" class="summary-icon" />
        </template>
      </SummaryCard>
    </div>

    <!-- data-table  -->
    <BaseTable
      table-name="products"
      :get-data="store.getProducts"
      :items-count="store.countAll"
      :data="store.products"
      :headers="headings"
    >
      <template #body>
        <template v-if="store.products">
          <tr class="[&_td]:(p2 px-4)" v-for="row in store.products">
            <TableBodyCell :value="row.id" />
            <TableBodyCell :value="row.name" variant="link" :to="`/products/${row.id}`" />
            <TableBodyCell :value="row.created_at" variant="date" />
            <TableBodyCell :value="row.category" />
            <TableBodyCell :value="row.stock" />
            <TableBodyCell :value="row.sell_price" />
            <TableBodyCell :value="row.delivery_type?.toString() || ''" />
            <TableBodyCell
              :value="row.published ? 'published' : 'unpublished'"
              variant="chip"
              :chip-status="row.published"
            />
          </tr>
        </template>
      </template>
    </BaseTable>
  </main>
</template>

<script setup lang="ts">
import { useProductsStore } from '~/store/products'

const headings = ['id', 'name', 'created_at', 'category', 'stock', 'sell_price', 'delivery_type', 'published']
const store = useProductsStore()

onMounted(() => {
  store.getCount()
  store.getProducts({ orderOptions: { column: 'id', ascending: false, foreignTable: '' }, page: 1, itemsPerPage: 10 })
})
</script>
