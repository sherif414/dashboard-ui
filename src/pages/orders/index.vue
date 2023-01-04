<template>
  <main class="p4 flex flex-col gap-y-4">
    <button
      class="fixed bottom-5rem right-5rem fill-primary-2 rounded-full p-3 shadow-lg typo-clr-on-primary"
      @click="orderDialogRef?.openModal"
    >
      <IAdd />
    </button>

    <!-- summary cards grid -->
    <div class="grid grid-cols-3 gap-x-4 row-span-1">
      <!-- all orders summary -->
      <SummaryCard
        :data="[
          { name: 'all orders', value: '450' },
          { name: 'pending', value: '50' },
          { name: 'completed', value: '400' },
        ]"
      >
        <template #icon>
          <IShoppingBag width="18" height="18" class="summary-icon" />
        </template>
      </SummaryCard>

      <!-- orders by state summary -->
      <SummaryCard
        :data="[
          { name: 'canceled orders', value: '30' },
          { name: 'returned', value: '10' },
          { name: 'damaged', value: '0' },
        ]"
      >
        <template #icon>
          <IShoppingBag width="18" height="18" class="summary-icon" />
        </template>
      </SummaryCard>

      <!-- carts summary -->
      <SummaryCard
        :data="[
          { name: 'abandoned carts', value: '20%' },
          { name: 'customers', value: '30' },
        ]"
      >
        <template #icon>
          <ICart width="18" height="18" class="summary-icon" />
        </template>
      </SummaryCard>
    </div>

    <!-- data-table  -->
    <BaseTable
      :get-data="store.getOrders"
      :show-search="false"
      table-name="orders"
      table-title="orders"
      :items-count="store.countAll"
      :data="store.orderList"
    >
      <template #header="{ sort, orderBy }">
        <TableHeaderCell
          v-for="head in headers"
          :key="head.column"
          :sort-ascending="orderBy.ascending"
          :order-by="orderBy.column"
          :column="head.column"
          @sort="sort(head.column, head.foreignTable)"
        >
          {{ head.label }}
        </TableHeaderCell>
      </template>

      <template #body>
        <tbody v-if="store.orderList">
          <tr v-for="order in store.orderList" :key="order.id">
            <td class="p2 px-4">{{ order.id ?? '-' }}</td>
            <td class="p2 px-4">{{ order.customers.name ?? '-' }}</td>
            <td class="p2 px-4">{{ useDateFormat(order.created_at, 'DD MMM YYYY').value || '-' }}</td>
            <td class="p2 px-4">{{ order.type ?? '-' }}</td>
            <td class="p2 px-4">${{ order.total_purchases ?? '-' }}</td>
            <td class="p2 px-4">{{ order.status ?? '-' }}</td>
          </tr>
        </tbody>
      </template>
    </BaseTable>

    <!-- create order dialog -->
    <OrderDialog @success="getOrders" ref="orderDialogRef" />
  </main>
</template>

<script setup lang="ts">
import { useOrderStore } from '~/store/orders'
import OrderDialog from '~/components/OrderDialog.vue'

const orderDialogRef = $ref<InstanceType<typeof OrderDialog> | null>(null)
const store = useOrderStore()
const headers = [
  {
    label: 'tracking id',
    column: 'id',
  },
  {
    label: 'customer name',
    column: 'name',
    foreignTable: 'customers',
  },
  {
    label: 'created at',
    column: 'created_at',
  },
  {
    label: 'order type',
    column: 'type',
  },
  {
    label: 'total purchases',
    column: 'total_purchases',
  },
  {
    label: 'status',
    column: 'status',
  },
]

function getOrders() {
  store.getOrders({ orderOptions: { column: 'id', foreignTable: '', ascending: true }, page: 1, itemsPerPage: 10 })
}

onMounted(() => {
  getOrders()
})
</script>
