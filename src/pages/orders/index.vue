<template>
  <main class="p4 pt-5rem pl-5rem flex flex-col gap-y-4 h-screen">
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
      table-name="orders"
      :items-count="store.countAll"
      :headers="headers"
      :data="store.orderList"
    />

    <!-- create order dialog -->
    <OrderDialog ref="orderDialogRef" />
  </main>
</template>

<script setup lang="ts">
import { useOrderStore } from '~/store/orders'
import OrderDialog from '~/components/OrderDialog.vue'

const orderDialogRef = $ref<InstanceType<typeof OrderDialog> | null>(null)
const store = useOrderStore()
const headers = ['id', 'owner', 'created_at', 'type', 'status', 'purchases']

onMounted(() => {
  store.getOrders({ orderBy: 'id', page: 1, itemsPerPage: 10, ascending: true })
})
</script>
