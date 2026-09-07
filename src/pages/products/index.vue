<template>
  <main class="p4 lg:p6 flex flex-col gap-6 overflow-y-auto w-full">
    <!-- add product action button -->
    <router-link
      to="/products/add"
      aria-label="Create new product"
      title="Create new product"
      class="fixed bottom-6 right-6 sm:(bottom-10 right-10) z-30 fill-primary-2 hover:fill-primary-3 active:scale-95 transition typo-clr-on-primary rounded-full p-3.5 shadow-lg focus:outline-none focus-visible:(ring-4 ring-offset-2 ring-indigo-5 dark:ring-violet-5)"
    >
      <IAdd width="22" height="22" />
    </router-link>

    <!-- summary cards -->
    <section class="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
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
          { name: 'out of stock', value: '0' },
          { name: 'low stock (< 20)', value: '2' },
          { name: 'in stock', value: store.countAll },
        ]"
      >
        <template #icon>
          <IInventory width="18" height="18" class="summary-icon" />
        </template>
      </SummaryCard>
    </section>

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
          <tr class="[&_td]:(p2 px-4)" v-for="row in store.products" :key="row.id">
            <TableBodyCell :value="row.id" />
            <TableBodyCell :value="row.name" variant="link" :to="`/products/${row.id}`" />
            <TableBodyCell :value="row.created_at" variant="date" />
            <TableBodyCell :value="row.category" />
            <TableBodyCell :value="row.stock" />
            <TableBodyCell :value="'$' + (row.sell_price || 0)" />
            <TableBodyCell :value="Array.isArray(row.delivery_type) ? row.delivery_type.join(', ') : (row.delivery_type || '-')" />
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
import { onMounted } from 'vue'
import { useProductsStore } from '~/store/products'
import SummaryCard from '~/components/SummaryCard.vue'
import BaseTable from '~/components/BaseTable.vue'
import TableBodyCell from '~/components/TableBodyCell.vue'
import { IAdd, IInventory } from '~/components/icons'

const headings = ['id', 'name', 'created_at', 'category', 'stock', 'sell_price', 'delivery_type', 'published']
const store = useProductsStore()

onMounted(() => {
  store.getCount()
  store.getProducts({ orderOptions: { column: 'id', ascending: false, foreignTable: '' }, page: 1, itemsPerPage: 10 })
})
</script>
