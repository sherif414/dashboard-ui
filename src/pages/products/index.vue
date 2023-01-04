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
            <td>{{ row.id || '-' }}</td>
            <td>
              <RouterLink v-if="row.id" class="hover:underline flex gap-2 items-center" :to="`/products/${row.id}`">
                <IExternalLink width="12" height="12" />
                {{ row.name || '-' }}
              </RouterLink>
            </td>
            <td>{{ row.created_at ? useDateFormat(row.created_at, 'DD MMM YYYY').value : '-' }}</td>
            <td>{{ row.category || '-' }}</td>
            <td>{{ row.stock || '-' }}</td>
            <td>{{ row.sell_price || '-' }}</td>
            <td>{{ row.delivery_type?.toString() || '-' }}</td>
            <td>{{ row.published === true ? 'published' : 'unpublished' }}</td>
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
  store.getProducts({ orderOptions: { column: 'id', ascending: true, foreignTable: '' }, page: 1, itemsPerPage: 10 })
})
</script>
