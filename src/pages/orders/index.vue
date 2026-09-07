<template>
  <main class="p4 flex flex-col gap-y-4 overflow-y-auto">
    <button
      class="fixed bottom-5rem right-5rem fill-primary-2 rounded-full p-3 shadow-lg typo-clr-on-primary cursor-pointer hover:scale-105 transition-transform"
      @click="orderDialogRef?.openModal"
    >
      <IAdd />
    </button>

    <!-- summary cards grid -->
    <div class="grid grid-cols-3 gap-x-4 row-span-1">
      <!-- all orders summary -->
      <SummaryCard
        :data="[
          { name: 'all orders', value: store.countAll ?? '8' },
          { name: 'pending', value: '3' },
          { name: 'completed', value: '5' },
        ]"
      >
        <template #icon>
          <IShoppingBag width="18" height="18" class="summary-icon" />
        </template>
      </SummaryCard>

      <!-- orders by state summary -->
      <SummaryCard
        :data="[
          { name: 'canceled orders', value: '0' },
          { name: 'returned', value: '0' },
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
          { name: 'conversion rate', value: '88%' },
          { name: 'active customers', value: '10' },
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
            <TableBodyCell :value="order.id" variant="link" :to="`/orders/${order.id}`" />
            <TableBodyCell :value="order.customers?.name ?? 'Customer #' + order.owner" />
            <TableBodyCell :value="order.created_at" variant="date" />
            <TableBodyCell :value="order.type" />
            <TableBodyCell :value="'$' + (order.total_purchases ?? 0)" />
            <TableBodyCell :value="order.status" variant="chip" :chip-status="order.status === 'completed'" />
          </tr>
        </tbody>
      </template>
    </BaseTable>

    <!-- create order dialog -->
    <OrderDialog @success="getOrders" ref="orderDialogRef" />
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useOrderStore } from '~/store/orders'
import SummaryCard from '~/components/SummaryCard.vue'
import BaseTable from '~/components/BaseTable.vue'
import TableHeaderCell from '~/components/TableHeaderCell.vue'
import TableBodyCell from '~/components/TableBodyCell.vue'
import OrderDialog from '~/components/OrderDialog.vue'
import { IAdd, IShoppingBag, ICart } from '~/components/icons'

const orderDialogRef = ref<InstanceType<typeof OrderDialog> | null>(null)
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
  store.getOrders({ orderOptions: { column: 'id', foreignTable: '', ascending: false }, page: 1, itemsPerPage: 10 })
}

onMounted(() => {
  getOrders()
})
</script>
